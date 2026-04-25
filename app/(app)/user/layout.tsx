import React, { ReactNode } from 'react'
import { RoleLayout } from '@/components/role-layout'
import { requireRole } from '@/lib/auth-helpers'

const UserLayout = async ({ children }: { children: ReactNode }) => {
  await requireRole('user')

  return <RoleLayout role="user">{children}</RoleLayout>
}

export default UserLayout
