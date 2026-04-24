'use client'

import { Mail, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  userEmail: string
  status: 'open' | 'in-progress' | 'on-hold' | 'closed'
  priority: 'low' | 'medium' | 'high'
  platform: string
  createdAt: string
  description: string
  assignedTo: string
}

interface TicketDetailProps {
  ticket: Ticket
  onClose: () => void
  onStatusChange: (ticketId: string, newStatus: Ticket['status']) => void
}

export function TicketDetail({
  ticket,
  onClose,
  onStatusChange,
}: TicketDetailProps) {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full md:w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{ticket.ticketNumber}</SheetTitle>
          <SheetDescription>{ticket.subject}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* User Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">User Information</h3>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
              <Mail className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-xs text-muted-foreground truncate">
                  {ticket.userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </p>
                <div className="mt-2">
                  <Select
                    value={ticket.status}
                    onValueChange={(value) =>
                      onStatusChange(
                        ticket.id,
                        value as Ticket['status']
                      )
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

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Priority
                </p>
                <p className="text-sm text-foreground mt-2 capitalize">
                  {ticket.priority}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Platform
                </p>
                <p className="text-sm text-foreground mt-2">{ticket.platform}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Assigned To
                </p>
                <p className="text-sm text-foreground mt-2">{ticket.assignedTo}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </p>
                <p className="text-sm text-foreground mt-2">{ticket.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Issue Description</h3>
            <p className="text-sm text-foreground leading-relaxed p-4 rounded-lg bg-secondary">
              {ticket.description}
            </p>
          </div>

          {/* Response Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Add Response</h3>
            <Textarea
              placeholder="Type your response here..."
              className="min-h-[120px] resize-none"
            />
            <Button className="w-full">Send Response</Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
