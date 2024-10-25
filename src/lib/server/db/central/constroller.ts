import { centralDb as db } from '$db/central'
import { tenants } from './schema'
import { createClient } from '@tursodatabase/api'

import { user as userC } from '$db/controller'
import { isValidEmail } from '$db/schema/user/controller'
import { subdomainRegex } from '$lib/utils'
import { eq } from 'drizzle-orm'

import {
  TURSO_GROUP_NAME,
  TURSO_ORGANIZATION_NAME,
  TURSO_PLATFORM_AUTH_TOKEN,
  TURSO_SCHEMA_DATABASE_NAME,
} from '$env/static/private'

import { PUBLIC_DOMAIN } from '$env/static/public'

import { hash } from '../schema/user/password'
import { getTenantDbClient } from '$lib/server/utils/init-db'
import { generateId } from '$lib/server/auth/utils'

export async function createTenant(newTenantInfo: {
  tenantName: unknown
  subdomain: unknown
  name: unknown
  email: unknown
  password: unknown
}) {
  const { tenantName, subdomain, email, password, name } = newTenantInfo
  if (typeof tenantName !== 'string' || tenantName.length < 4) {
    return {
      success: false,
      message: 'Tenant name must be at least 4 characters long',
    }
  }

  if (
    typeof subdomain !== 'string' ||
    subdomain.length < 4 ||
    subdomainRegex.test(subdomain)
  ) {
    return {
      success: false,
      message:
        'subdomain contains only alphabetic characters, numbers, and hyphens (-), and cannot end with a hyphen and must be at least 4 characters long',
    }
  }

  if (typeof email !== 'string' || !isValidEmail(email)) {
    return {
      success: false,
      message: 'Invalid email',
    }
  }

  if (typeof password !== 'string' || password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters long',
    }
  }

  if (typeof name !== 'string' || name.length < 4) {
    return {
      success: false,
      message: 'name must be at least 4 characters long',
    }
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.subdomain, subdomain),
  })

  if (tenant) {
    return {
      success: false,
      message: 'Subdomain already exists',
    }
  }

  const tursoPlatform = createClient({
    org: TURSO_ORGANIZATION_NAME,
    token: TURSO_PLATFORM_AUTH_TOKEN,
  })

  const databaseName = `v1-${subdomain}`
  const data = await tursoPlatform.databases.create(databaseName, {
    group: TURSO_GROUP_NAME,
    schema: TURSO_SCHEMA_DATABASE_NAME,
  })

  console.log('new db:', data)
  const passwordHash = await hash(password)

  const companyData = await db
    .insert(tenants)
    .values({
      subdomain,
      name: tenantName,
      databaseName,
    })
    .returning()

  const tenantDb = getTenantDbClient(databaseName)

  const userData = await userC(tenantDb).insertUser({
    id: generateId(25),
    email,
    username: 'admin',

    role: 'admin',
    password_hash: passwordHash,
  })

  console.log('new user:', userData)
  console.log('new tenant:', companyData)
  return {
    success: true,
    data: {
      domain: `http://${subdomain}.${PUBLIC_DOMAIN}`,
    },
  }
}