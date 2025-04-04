/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PageServerLoad } from './$types'

import * as schema from '$lib/server/db/schema'
import {
  withPagination,
  withOrderBy,
  getSQLiteColumn,
  getOrderBy,
  innerJoinOnMany,
} from '$lib/server/db/utils'
import {
  and,
  eq,
  getTableColumns,
  SQL,
  count,
  like,
  gt,
  lt,
  lte,
  sum,
  sql,
  asc,
  desc,
} from 'drizzle-orm'
import { customer } from '$lib/server/db/controller'
import { gte } from 'drizzle-orm'
import { Monad } from '$lib/utils'
import { pageConfig } from '$lib/config'

export const load = (async ({ url, locals: { tenantDb } }) => {
  const { searchParams } = url
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('pageSize') ?? pageConfig.rowPages)

  const name = searchParams.get('name')
  const cashier = searchParams.get('created_by')

  const sortId = searchParams.get('sort_id')
  const sortOrder = searchParams.get('sort_order')

  const dateStart = searchParams.get('startDate')
  const dateEnd = searchParams.get('endDate')

  let query = Monad.of(
    tenantDb!
      .select({
        //Order:
        id: schema.customerOrderTable.id,
        created_at: schema.customerOrderTable.created_at,
        updated_at: schema.customerOrderTable.updated_at,
        is_fiado: schema.customerOrderTable.is_fiado,
        observation: schema.customerOrderTable.observation,
        amount_paid: schema.customerOrderTable.amount_paid,
        total: schema.customerOrderTable.total,
        status: schema.customerOrderTable.status,
        type: schema.customerOrderTable.type,
        expire_at: schema.customerOrderTable.expire_at,

        //customer:
        name: schema.customerTable.name,
        email: schema.customerTable.email,
        cellphone: schema.customerTable.cellphone,

        //cashier
        // cashier: schema.cashierTable.name,
        created_by: schema.userTable.username,
      })
      .from(schema.customerOrderTable)
      .$dynamic()
      .where(
        and(
          dateStart && dateEnd
            ? and(
                gte(
                  schema.customerOrderTable.created_at,
                  new Date(Number(dateStart)),
                ),
                lte(
                  schema.customerOrderTable.created_at,
                  new Date(Number(dateEnd)),
                ),
              )
            : undefined,
        ),
      ),
  )
    .map(q =>
      innerJoinOnMany(q, schema.customerTable, [
        eq(schema.customerTable.id, schema.customerOrderTable.customer_id),
        name ? like(schema.customerTable.name, `${name}%`) : undefined,
      ]),
    )
    .map(q =>
      innerJoinOnMany(q, schema.userTable, [
        eq(schema.userTable.id, schema.customerOrderTable.created_by),
        cashier ? like(schema.userTable.username, `%${cashier}%`) : undefined,
      ]),
    )
    .get()

  console.log(query.toSQL())

  if (sortId && sortOrder) {
    query = withOrderBy(
      query,
      getSQLiteColumn(schema.customerOrderTable, sortId),
      sortOrder,
    )
  }

  try {
    const rows = await withPagination(query, page, pageSize)

    const total = await tenantDb!
      .select({ count: count() })
      .from(schema.customerOrderTable)

    const totalSumResult = await tenantDb!
      .select({
        totalSum: sql<number>`SUM(${schema.customerOrderTable.total})`,
      })
      .from(schema.customerOrderTable)
      .leftJoin(
        schema.customerTable,
        eq(schema.customerTable.id, schema.customerOrderTable.customer_id),
      )
      .where(
        and(
          name ? like(schema.customerTable.name, `%${name}%`) : undefined,
          dateStart && dateEnd
            ? and(
                gte(
                  schema.customerOrderTable.created_at,
                  new Date(Number(dateStart)),
                ),
                lte(
                  schema.customerOrderTable.created_at,
                  new Date(Number(dateEnd)),
                ),
              )
            : undefined,
          // cashier ? like(schema.cashierTable.name, `%${cashier}%`) : undefined,
        ),
      )

    const totalSum = totalSumResult[0]?.totalSum ?? 0

    return { rows: rows ?? [], count: total[0].count, totalSum }
  } catch (error) {
    console.error(error)
    return { rows: [], count: 0, totalSum: 0 }
  }
  return { rows: [], count: 0, totalSum: 0 }
}) satisfies PageServerLoad
