import { redirect } from 'next/navigation'
import { getDefaultAppPath, getSessionRole, requireSession } from '@/lib/auth-helpers'

export default async function AuthRedirectPage() {
  const session = await requireSession()

  redirect(getDefaultAppPath(getSessionRole(session)))
}
