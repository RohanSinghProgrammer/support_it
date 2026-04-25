import React, { ReactNode } from 'react'
import { RoleLayout } from '@/components/role-layout'

const UserLayout = ({ children }: { children: ReactNode }) => {
  return <RoleLayout role="user">{children}</RoleLayout>
}

export default UserLayout
