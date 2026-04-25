import { Clock, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { UserTicket } from './types'

export function TicketCard({ ticket }: { ticket: UserTicket }) {
  return (
    <Card className="border-border/60 shadow-sm transition-colors hover:border-accent/40">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4 max-sm:flex-col">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-accent">{ticket.ticketNumber}</span>
              <StatusBadge status={ticket.status} />
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {ticket.platform}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{ticket.subject}</h3>
          </div>
        </div>

        <p className="mb-5 text-sm leading-7 text-muted-foreground">{ticket.description}</p>

        <div className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Created {ticket.createdAt}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Updated {ticket.updatedAt}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
