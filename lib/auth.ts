import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'

export type AuthUserRole = 'admin' | 'staff' | 'user'

const appUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'http://localhost:3000'

const connectionString = process.env.NEON_DB_URI

if (!connectionString) {
  throw new Error('NEON_DB_URI is required to initialize Better Auth.')
}

const globalForDb = globalThis as typeof globalThis & {
  supportItAuthPool?: Pool
}

export const authDb =
  globalForDb.supportItAuthPool ??
  new Pool({
    connectionString,
    ssl: connectionString.includes('localhost')
      ? undefined
      : {
          rejectUnauthorized: false,
        },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.supportItAuthPool = authDb
}

function parseEmailList(value?: string) {
  return new Set(
    (value ?? '')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  )
}

const adminEmails = parseEmailList(process.env.AUTH_ADMIN_EMAILS)
const staffEmails = parseEmailList(process.env.AUTH_STAFF_EMAILS)

function resolveRoleFromEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (adminEmails.has(normalizedEmail)) {
    return 'admin'
  }

  if (staffEmails.has(normalizedEmail)) {
    return 'staff'
  }

  return 'user'
}

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET)

export const auth = betterAuth({
  appName: 'SupportIt',
  baseURL: appUrl,
  database: authDb,
  trustedOrigins: Array.from(
    new Set(
      [appUrl, process.env.NEXT_PUBLIC_APP_URL, 'http://localhost:3000'].filter(
        (value): value is string => Boolean(value)
      )
    )
  ),
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          prompt: 'select_account',
        },
      }
    : {},
  user: {
    additionalFields: {
      role: {
        type: ['admin', 'staff', 'user'] satisfies AuthUserRole[],
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: resolveRoleFromEmail(user.email),
            },
          }
        },
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session
