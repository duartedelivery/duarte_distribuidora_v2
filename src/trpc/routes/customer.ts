import { publicProcedure, router } from '../t'

import { z } from 'zod'
import { customer as customerController } from '$db/controller'
import {
  insertCustomerSchema,
  insertAddressSchema,
  customerTable,
} from '$lib/server/db/schema'

import { paramsSchema } from '$lib/components/table'
import { tableHelper } from '$lib/server/db/utils'

import { middleware } from '../middleware'

export const customer = router({
  insertCustomer: publicProcedure
    .use(middleware.auth)
    .input(insertCustomerSchema)
    .mutation(async ({ input }) => {
      return await customerController.insertCustomer(input)
    }),
  updateCustomer: publicProcedure
    .use(middleware.auth)
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
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, customer } = input
      return await customerController.updateCustomer(id, customer)
    }),
  insertAddress: publicProcedure
    .use(middleware.auth)
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
    // .use(middleware.auth)
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
          payment_method: z.enum(['pix', 'credit_card', 'fiado', 'dinheiro']),
          customer_id: z.number().optional(),
          address_id: z.number().optional(),
          total: z.number(),
          distribuidora_id: z.number(),
          observation: z.string(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const { order_items, order_info } = input

      try {
        return await customerController.insertOrder({
          order_items,
          order_info,
        })
      } catch (error) {
        console.error('Failed to insert order:', error)
      }
    }),

  updateOrderStatus: publicProcedure
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
})
