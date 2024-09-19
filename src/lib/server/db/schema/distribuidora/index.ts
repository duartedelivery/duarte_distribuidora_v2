/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  sqliteTable,
  text,
  integer,
  // customType,
} from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'
import { imageTable } from '../image'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { customerOrderTable } from '../customer'

export const cashierTable = sqliteTable('caixas', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  name: text('name').notNull(),
  status: text('status', { enum: ['Aberto', 'Fechado'] })
    .notNull()
    .default('Fechado'),
  currency: integer('currency').notNull().default(0),
})

export const cachierRelations = relations(cashierTable, ({ one, many }) => ({
  transactions: many(cashierTransactionTable),
}))
export const insertCashierSchema = createInsertSchema(cashierTable)
export type InsertCashier = typeof cashierTable.$inferInsert
export type SelectCashier = typeof cashierTable.$inferSelect

export const cashierTransactionEnum = [
  'Entrada',
  'Saida',
  'Troco',
  'PAGAMENTO',
] as const
export const cashierTransactionTable = sqliteTable('transacao_caixa_dinheiro', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date(),
  ),
  cashier_id: integer('cashier_id')
    .notNull()
    .references(() => cashierTable.id),
  amount: integer('amount').notNull().default(0),
  observation: text('observation'),
  type: text('type', { enum: cashierTransactionEnum }).notNull(),
  order_id: integer('order_id').references(()=> customerOrderTable.id),
  meta_data: text('meta_data', { mode: 'json' }).notNull(),
})

export const cashierTransactionRelations = relations(
  cashierTransactionTable,
  ({ one, many }) => ({
    cashier: one(cashierTable, {
      fields: [cashierTransactionTable.cashier_id],
      references: [cashierTable.id],
    }),
  }),
)

export type InsertCashierTransaction =
  typeof cashierTransactionTable.$inferInsert
export type SelectCashierTransaction =
  typeof cashierTransactionTable.$inferSelect
