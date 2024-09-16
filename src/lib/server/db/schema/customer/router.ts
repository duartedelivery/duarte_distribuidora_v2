/* eslint-disable @typescript-eslint/no-unused-vars */
import { publicProcedure, router } from '$trpc/t'

import { z } from 'zod'
import { customer as customerController } from '$db/controller'
import {
  insertCustomerSchema,
  insertAddressSchema,
  customerTable,
  paymentMethodEnum,
  paymentStatusEnum,
  insertOrderPaymentSchema,
  cashierTransactionTable,
  orderPaymentTable,
  customerOrderTable,
  type InsertOrderPayment,
  orderItemTable,
} from '$lib/server/db/schema'

import { paramsSchema } from '$lib/components/table'
import { tableHelper } from '$lib/server/db/utils'

import { middleware } from '$trpc/middleware'
import { db } from '../..'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

export const customer = router({
  insertCustomer: publicProcedure
    .use(middleware.auth)
    .use(middleware.logged)

    .input(insertCustomerSchema)
    .mutation(async ({ input }) => {
      return await customerController.insertCustomer(input).returning()
    }),
  updateCustomer: publicProcedure
    .use(middleware.auth)
    .use(middleware.logged)
    .input(
      z.object({
        id: z.number(),
        customer: z.object({
          name: z.string().optional(),
          cellphone: z.string().optional(),
          phone: z.string().optional(),
          max_credit: z.number().optional(),
          used_credit: z.number().optional(),
          email: z.string().email().optional(),
          is_retail: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, customer } = input
      return await customerController.updateCustomer(id, customer)
    }),

  deleteCustomer: publicProcedure
    .use(middleware.logged)
    .use(middleware.auth)

    .input(z.number())
    .mutation(async ({ input }) => {
      return await customerController.deleteCustomerById(input)
    }),

  insertAddress: publicProcedure
    .use(middleware.auth)
    .use(middleware.logged)
    .input(insertAddressSchema)
    .mutation(async ({ input }) => {
      try {
        return await customerController.insertAddress(input)
      } catch (error) {
        console.error('Failed to insert address:', error)
      }
    }),
  getPaginatedCustomers: publicProcedure
    .input(paramsSchema)
    .query(async ({ input }) => {
      return await tableHelper(
        customerController.getCustomers().$dynamic(),
        customerTable,
        'name',
        input,
      )
    }),

  getCustomers: publicProcedure.query(async () => {
    return await customerController.getCustomersWithAddress()
  }),

  insertOrder: publicProcedure
    .use(middleware.auth)
    .use(middleware.logged)
    .input(
      z.object({
        order_items: z.array(
          z.object({
            product_id: z.number(),
            quantity: z.number(),
            price: z.number(),
          }),
        ),
        order_info: z.object({
          customer_id: z.number().optional(),
          address_id: z.number().optional(),
          total: z.number(),
          observation: z.string(),
          cachier_id: z.number().optional(),
        }),
        payment_info: insertOrderPaymentSchema.omit({ order_id: true }).array(),
      }),
    )
    .mutation(async ({ input }) => {
      const { order_items, order_info, payment_info } = input

      const total_paid = payment_info.reduce(
        (acc, payment) => acc + payment.amount_paid,
        0,
      )

      if (total_paid < order_info.total) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'Valor pago é menor que o total da compra, adicione mais pagamentos',
        })
      }

      return await db.transaction(async tx => {
        const [order] = await tx
          .insert(customerOrderTable)
          .values({
            status: 'PENDING',
            total: order_info.total,
            customer_id: order_info.customer_id,
            address_id: order_info.address_id,
          })
          .returning()

        const items = order_items.map(item => ({
          ...item,
          order_id: order.id,
        }))

        const [customer] = order_info.customer_id
          ? await tx
              .select()
              .from(customerTable)
              .where(eq(customerTable.id, order_info.customer_id))
          : [null]

        const total_fiado = payment_info
          .filter(payment => payment.payment_method === 'fiado')
          .reduce((acc, payment) => acc + payment.amount_paid, 0)

        if (
          customer &&
          customer.max_credit < total_fiado + customer.used_credit
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cliente não possui crédito suficiente para esta compra',
          })
        }

        for (const payment of payment_info || []) {
          switch (payment.payment_method) {
            case 'dinheiro': {
              if (order_info.cachier_id && payment.troco) {
                await tx.insert(cashierTransactionTable).values({
                  cashier_id: order_info.cachier_id,
                  amount: payment.amount_paid,
                  observation: `Venda ${order.id}`,
                  type: 'Entrada',
                  meta_data: {
                    order_id: order.id,
                    payment_method: payment.payment_method,
                  },
                })
                await tx.insert(cashierTransactionTable).values({
                  cashier_id: order_info.cachier_id,
                  amount: payment.troco,
                  observation: `Venda ${order.id}`,
                  type: 'Troco',
                  meta_data: {
                    order_id: order.id,
                    payment_method: payment.payment_method,
                  },
                })
              }

              break
            }
            case 'fiado': {
              break
            }
            // case 'credit_card': {
            //   break
            // }
            // case 'debit_card': {
            //   break
            // }
            // case 'pix': {
            //   break
            // }

            default: {
              if (order_info.cachier_id) {
                await tx.insert(cashierTransactionTable).values({
                  cashier_id: order_info.cachier_id,
                  amount: payment.amount_paid,
                  observation: `Venda ${order.id}`,
                  type: 'PAGAMENTO',
                  meta_data: {
                    order_id: order.id,
                    payment_method: payment.payment_method,
                  },
                })
              }
              await tx.insert(orderPaymentTable).values({
                ...payment,
                order_id: order.id,
              })
              break
            }
          }

          await tx
            .insert(orderPaymentTable)
            .values({ ...payment, order_id: order.id })
        }

        await tx.insert(orderItemTable).values(items)
        return {
          order,
          items,
        }
      })
    }),

  updateOrderStatus: publicProcedure
    .use(middleware.logged)
    .use(middleware.auth)
    .input(
      z.object({
        order_id: z.number(),
        status: z.enum([
          'PENDING',
          'CONFIRMED',
          'PREPARING',
          'ON THE WAY',
          'DELIVERED',
          'CANCELED',
          'ENDED',
        ]),
      }),
    )
    .mutation(async ({ input }) => {
      const { order_id, status } = input
      return await customerController.updateOrderStatus(order_id, status)
    }),

  // updateOrderPaymentStatus: publicProcedure
  //   .use(middleware.logged)
  //   .use(middleware.auth)
  //   .input(
  //     z.object({
  //       order_id: z.number(),
  //       payment_status: z.enum([
  //         'PENDING',
  //         'CONFIRMED',
  //         'CANCELED',
  //         'REFUNDED',
  //       ]),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const { order_id, payment_status } = input
  //     return await customerController.updateOrderPaymentStatus(
  //       order_id,
  //       payment_status,
  //     )
  //   }),

  insertOrderPayment: publicProcedure
    .use(middleware.logged)
    .input(insertOrderPaymentSchema)
    .mutation(async ({ input }) => {
      return await customerController.insertOrderPayment(input).returning()
    }),

  getOrderPayments: publicProcedure
    .use(middleware.logged)
    .input(z.number())
    .query(async ({ input }) => {
      return await customerController.getOrderPayments(input)
    }),

  updateOrderPayment: publicProcedure
    .use(middleware.auth)
    .use(middleware.logged)
    .input(z.object({
      id: z.number(),
      data:insertOrderPaymentSchema.partial()}))
    .mutation(({ input }) => {
      const {id,data} = input
      return customerController.updateOrderPayment(id,data)
    }),

  getCurrentOrders: publicProcedure.use(middleware.logged).query(() => {
    return customerController.getCurrentOrders()
  }),
})
