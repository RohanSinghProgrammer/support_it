import { Clock, Calendar } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  status: 'open' | 'in-progress' | 'on-hold' | 'closed'
  createdAt: string
  updatedAt: string
  description: string
  platform: string
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 hover:border-accent transition-colors hover:shadow-md cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-accent text-sm">
              {ticket.ticketNumber}
            </span>
            <StatusBadge status={ticket.status} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {ticket.subject}
          </h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {ticket.description}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          Created {ticket.createdAt}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          Updated {ticket.updatedAt}
        </div>
        <div className="ml-auto">
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground">
            {ticket.platform}
          </span>
        </div>
      </div>
    </div>
  )
}
