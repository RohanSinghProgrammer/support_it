import { BarChart3, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { AppLayout } from '@/components/app-layout'
import { StatCard } from '@/components/stat-card'
import { DashboardStats } from '../_components/dashboard-stats'
import { PlatformsSection } from '../_components/platforms-section'
import { StaffSection } from '../_components/staff-section'

export const metadata = {
  title: 'Admin Dashboard | SupportIt',
  description: 'Manage tickets, platforms, and staff',
}

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s your system overview.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Platforms Management */}
      <PlatformsSection type='component' />

      {/* Staff Management */}
      <StaffSection />
    </div>
  )
}
