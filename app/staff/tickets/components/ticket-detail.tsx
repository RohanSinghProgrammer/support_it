'use client'

import { CalendarDays, CircleDot, Mail, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/status-badge'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { StaffTicket } from './types'

const priorityBadgeClassName: Record<StaffTicket['priority'], string> = {
  high: 'rounded-full border-red-200 bg-red-50 px-3 py-1 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
  medium:
    'rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
  low: 'rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
}

interface TicketDetailProps {
  ticket: StaffTicket
  onClose: () => void
  onStatusChange: (ticketId: string, newStatus: StaffTicket['status']) => void
}

export function TicketDetail({
  ticket,
  onClose,
  onStatusChange,
}: TicketDetailProps) {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b border-border/70 pb-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-sm">
                {ticket.ticketNumber}
              </Badge>
              <StatusBadge status={ticket.status} />
              <Badge variant="outline" className={priorityBadgeClassName[ticket.priority]}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} priority
              </Badge>
            </div>
            <div className="space-y-1">
              <SheetTitle className="text-2xl">{ticket.subject}</SheetTitle>
              <SheetDescription>
                Review the full request, update the ticket status, and send the next response.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 p-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Requester
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground break-all">
                    {ticket.userEmail}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Assigned staff
                  </p>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    {ticket.assignedTo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Status
              </p>
              <div className="mt-3">
                <Select
                  value={ticket.status}
                  onValueChange={(value) =>
                    onStatusChange(ticket.id, value as StaffTicket['status'])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Platform
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <CircleDot className="h-4 w-4 text-muted-foreground" />
                {ticket.platform}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Created
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {ticket.createdAt}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Last updated
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {ticket.updatedAt}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Issue description</h3>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-sm leading-7 text-foreground">{ticket.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Reply to requester</h3>
            <Textarea
              placeholder="Draft your response, summarize what changed, or ask for follow-up details..."
              className="min-h-[140px] resize-none rounded-xl"
            />
            <Button className="w-full">Send Response</Button>
          </div>
        </div>

        <SheetFooter className="border-t border-border/70 bg-background/95">
          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
