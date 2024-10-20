/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  skuTable,
  stockTransactionTable,
  supplierTable,
  cashierTransactionTable,
} from '$db/schema'

import type {
  SelectProductItem,
  InsertStockTransaction,
  SelectSku,
  InsertSku,
  SelectStockTransaction,
  SelectSupplier,
  InsertSupplier,
} from '$db/schema'

import { and, desc, eq, gt, ne, sql } from 'drizzle-orm'
import { LibsqlError } from '@libsql/client'
import type { TenantDbType } from '../../tenant'

export const stock = (db: TenantDbType) => ({
  insertSKU(data: InsertSku) {
    return db.insert(skuTable).values(data)
  },
  getSKU() {
    return db.select().from(skuTable)
  },
  getSKUWithStock() {
    return db.select().from(skuTable)
  },
  getSKUByID(sku_id: SelectSku['sku']) {
    return db.query.skuTable.findFirst({
      where: eq(skuTable.sku, sku_id),
    })
  },
  deleteItemStock(sku: SelectSku['sku']) {
    return db.delete(skuTable).where(eq(skuTable.sku, sku))
  },
  getTransactionsFromProduto(data: { sku: SelectSku['sku'] }) {
    const { sku } = data
    return db
      .select()
      .from(stockTransactionTable)
      .where(eq(stockTransactionTable.sku, sku))
  },
  async insertStockTransaction(
    data: Omit<InsertStockTransaction, 'total_log'>,
  ) {
    const { sku } = data
    return await db.transaction(async trx => {
      const [resp] = await trx
        .update(skuTable)
        .set({
          quantity: sql`${skuTable.quantity} + ${data.quantity}`,
        })
        .where(eq(skuTable.sku, sku))
        .returning()
      await trx.insert(stockTransactionTable).values({
        ...data,
        total_log: resp.quantity,
      })
    })
  },
  insertSupplier(data: InsertSupplier) {
    return db.insert(supplierTable).values(data)
  },
  getSupplier() {
    return db.select().from(supplierTable)
  },
  updateSupplier(
    id: SelectSupplier['id'],
    supplier: Partial<SelectSupplier>,
  ) {
    return db
      .update(supplierTable)
      .set(supplier)
      .where(eq(supplierTable.id, id))
      .run()
  },
  queryLastCostPrice(sku: SelectSku['sku']) {
    return db.query.stockTransactionTable.findFirst({
      where: t => and(eq(t.sku, sku), eq(t.type, 'Entrada'), gt(t.cost_price, 0)),
      columns: {
        cost_price: true,
      },
      orderBy: [desc(stockTransactionTable.created_at)],
    })
  },
  getRecentTransactionsCaixa(id: number) {
    return db
      .select()
      .from(cashierTransactionTable)
      .where(eq(cashierTransactionTable.cachier_id, id))
      .orderBy(desc(cashierTransactionTable.created_at))
      .limit(15)
  },
  getAllTransactionsCaixa() {
    return db
      .select()
      .from(cashierTransactionTable)
      .orderBy(desc(cashierTransactionTable.created_at))
  }
})
