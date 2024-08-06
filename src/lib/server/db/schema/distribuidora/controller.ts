/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  skuTable,
  distribuidoraTable,
  productStockTable,
  cashierTable,
  cashierTransactionTable,
  stockTransactionTable,
} from '$db/schema'

import type {
  SelectDistribuidora,
  InsertDistribuidora,
  SelectCashier,
  InsertCashier,
  SelectCashierTransaction,
  InsertCashierTransaction,
} from '$db/schema'

import { db } from '$db'
import { eq, sql } from 'drizzle-orm'

function insertDistribuidora(data: InsertDistribuidora) {
  return db.insert(distribuidoraTable).values(data)
}
function getDistribuidoras() {
  return db.select().from(distribuidoraTable)
}

function getDistribuidoraById(id: SelectDistribuidora['id']) {
  return db
    .select()
    .from(distribuidoraTable)
    .where(eq(distribuidoraTable.id, id))
}

function insertCashier(data: InsertCashier) {
  return db.insert(cashierTable).values(data)
}

function getCashier() {
  return db.select().from(cashierTable)
}
function getCashierById(id: SelectCashier['id']) {
  return db.select().from(cashierTable).where(eq(cashierTable.id, id))
}

function queryCashierByDistribuidora() {
  return db.query.distribuidoraTable.findMany({
    with: {
      cashiers: true,
    },
  })
}

function insertCashierTransaction(data: InsertCashierTransaction) {
  return db.transaction(async trx => {
    await trx.insert(cashierTransactionTable).values(data)
    await trx
      .update(cashierTable)
      .set({
        currency: sql`${cashierTable.currency} + ${data.amount}`,
      })
      .where(eq(cashierTable.id, data.cashier_id))
  })
}

function getCashierTransactions(cachier_id: SelectCashier['id']) {
  return db
    .select()
    .from(cashierTransactionTable)
    .where(eq(cashierTransactionTable.cashier_id, cachier_id))
}

export const distribuidora = {
  tables: {
    distribuidoraTable,
  },
  getDistribuidoras,
  insertDistribuidora,
  getDistribuidoraById,
  insertCashier,
  getCashier,
  getCashierById,
  insertCashierTransaction,
  getCashierTransactions,
  queryCashierByDistribuidora,
}
