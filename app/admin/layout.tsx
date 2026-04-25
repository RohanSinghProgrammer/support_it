import { AppLayout } from '@/components/app-layout'
import React, { ReactNode } from 'react'

const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <AppLayout userRole='admin'>
            {children}
        </AppLayout>
    )
}

export default AdminLayout
