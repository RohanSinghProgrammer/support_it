import { authDb } from '@/lib/auth'

type QueryValue = string | number | boolean | null | Date

const globalForSchema = globalThis as typeof globalThis & {
  supportItAppSchemaPromise?: Promise<void>
}

export async function ensureAppSchema() {
  if (!globalForSchema.supportItAppSchemaPromise) {
    globalForSchema.supportItAppSchemaPromise = (async () => {
      await authDb.query(`
        ALTER TABLE "user"
        ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
      `)

      await authDb.query(`
        CREATE TABLE IF NOT EXISTS platforms (
          id text PRIMARY KEY,
          name text NOT NULL UNIQUE,
          description text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `)

      await authDb.query(`
        CREATE TABLE IF NOT EXISTS tickets (
          id text PRIMARY KEY,
          ticket_number text NOT NULL UNIQUE,
          subject text NOT NULL,
          description text NOT NULL,
          status text NOT NULL,
          priority text NOT NULL,
          requester_name text,
          requester_email text NOT NULL,
          platform_id text REFERENCES platforms(id) ON DELETE SET NULL,
          platform_name text NOT NULL,
          user_id text REFERENCES "user"(id) ON DELETE SET NULL,
          assigned_to_user_id text REFERENCES "user"(id) ON DELETE SET NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `)

      await authDb.query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id)
      `)
      await authDb.query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to_user_id ON tickets(assigned_to_user_id)
      `)
      await authDb.query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_platform_id ON tickets(platform_id)
      `)
      await authDb.query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)
      `)
      await authDb.query(`
        CREATE INDEX IF NOT EXISTS idx_tickets_requester_email ON tickets(requester_email)
      `)
    })()
  }

  await globalForSchema.supportItAppSchemaPromise
}

export async function dbQuery<T>(query: string, values?: QueryValue[]) {
  await ensureAppSchema()
  return authDb.query<T>(query, values)
}
