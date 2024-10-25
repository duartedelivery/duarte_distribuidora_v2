/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PageServerLoad } from './$types'

import * as schema from '$lib/server/db/schema'
import {
  withPagination,
  withOrderBy,
  getSQLiteColumn,
  getOrderBy,
} from '$lib/server/db/utils'
import { and, eq, getTableColumns, SQL, count, like } from 'drizzle-orm'

export const load = (async ({ url,locals:{tenantDb} }) => {
  const { searchParams } = url
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('pageSize') ?? 10)

  const name = searchParams.get('name')
  const email = searchParams.get('email')
  const phone = searchParams.get('phone')
  const cpf_cnpj= searchParams.get('cpf_cnpj')

  const sortId = searchParams.get('sort_id')
  const sortOrder = searchParams.get('sort_order')

  let query = tenantDb!
    .select()
    .from(schema.customerTable)
    .where(
      and(
        name ? like(schema.customerTable.name, `${name}%`) : undefined,
        email ? like (schema.customerTable.email, `${email}%`): undefined,
        phone ? like (schema.customerTable.phone, `${phone}%`): undefined,
        cpf_cnpj ? like (schema.customerTable.cpf_cnpj, `${cpf_cnpj}%`): undefined,
      )

    )
    .$dynamic()

  if (sortId && sortOrder) {
    query = withOrderBy(
      query,
      getSQLiteColumn(schema.customerTable, sortId),
      sortOrder,
    )
  }

  try {
    const rows = await withPagination(query, page, pageSize)

    const total = await tenantDb!.select({ count: count() }).from(schema.customerTable)

    return { rows: rows ?? [], count: total[0].count }
  } catch (error) {
    console.error(error)
    return { rows: [], count: 0 }
  }
}) satisfies PageServerLoad