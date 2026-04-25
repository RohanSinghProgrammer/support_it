import React, { ReactNode } from 'react'
import { RoleLayout } from '@/components/role-layout'
import { requireRole } from '@/lib/auth-helpers'

const StaffLayout = async ({ children }: { children: ReactNode }) => {
  await requireRole('staff')

  return <RoleLayout role="staff">{children}</RoleLayout>
}

export default StaffLayout
