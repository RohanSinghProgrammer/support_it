import { BarChart3, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { StatCard } from '@/components/stat-card'

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Tickets"
        value="1,248"
        subtitle="All time"
        icon={BarChart3}
        trend={{ direction: 'up', percentage: 12 }}
      />
      <StatCard
        title="Open Tickets"
        value="42"
        subtitle="Awaiting response"
        icon={AlertCircle}
        trend={{ direction: 'down', percentage: 5 }}
      />
      <StatCard
        title="Resolved"
        value="1,206"
        subtitle="This month"
        icon={CheckCircle}
        trend={{ direction: 'up', percentage: 8 }}
      />
      <StatCard
        title="Avg Response Time"
        value="2.5h"
        subtitle="Across all tickets"
        icon={Clock}
        trend={{ direction: 'down', percentage: 3 }}
      />
    </div>
  )
}
