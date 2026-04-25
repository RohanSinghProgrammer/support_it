import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import type { AuthUserRole, Session } from '@/lib/auth'

export function getDefaultAppPath(role: AuthUserRole | undefined) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'staff':
      return '/staff/tickets'
    default:
      return '/user/tickets'
  }
}

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function requireSession() {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return session
}

export async function redirectIfAuthenticated() {
  const session = await getServerSession()

  if (session) {
    redirect(getDefaultAppPath(getSessionRole(session)))
  }
}

export async function requireRole(role: AuthUserRole) {
  const session = await requireSession()

  if (getSessionRole(session) !== role) {
    redirect(getDefaultAppPath(getSessionRole(session)))
  }

  return session
}

export function getSessionRole(session: Session | null | undefined) {
  const userWithRole = session?.user as (Session['user'] & { role?: AuthUserRole }) | undefined
  return userWithRole?.role ?? 'user'
}
