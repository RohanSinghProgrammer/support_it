import { AppLayout } from '@/components/app-layout'
import { requireRole } from '@/lib/auth-helpers'
import React, { ReactNode } from 'react'

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  await requireRole('admin')

  return <AppLayout userRole="admin">{children}</AppLayout>
}

export default AdminLayout
