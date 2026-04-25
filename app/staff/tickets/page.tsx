import { AppLayout } from '@/components/app-layout'
import { TicketsTable } from './components/tickets-table'

export const metadata = {
  title: 'Support Tickets | SupportIt',
  description: 'View and manage support tickets',
}

export default function StaffTickets() {
  return (
    <AppLayout userRole="staff">
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Support Tickets
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and respond to customer support tickets
          </p>
        </div>

        {/* Tickets List */}
        <TicketsTable />
      </div>
    </AppLayout>
  )
}
