import { TicketsTable } from './components/tickets-table'

export const metadata = {
  title: 'Support Tickets | SupportIt',
  description: 'View and manage support tickets',
}

export default function StaffTickets() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          Support Tickets
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage customer requests, update ticket statuses, and keep responses moving.
        </p>
      </div>

      <TicketsTable />
    </div>
  )
}
