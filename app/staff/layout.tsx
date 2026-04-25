import React, { ReactNode } from 'react'
import { RoleLayout } from '@/components/role-layout'

const StaffLayout = ({ children }: { children: ReactNode }) => {
  return <RoleLayout role="staff">{children}</RoleLayout>
}

export default StaffLayout
