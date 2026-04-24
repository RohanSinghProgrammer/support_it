'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AppLayout } from '@/components/app-layout'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TicketCard } from './components/ticket-card'

interface UserTicket {
  id: string
  ticketNumber: string
  subject: string
  status: 'open' | 'in-progress' | 'on-hold' | 'closed'
  createdAt: string
  updatedAt: string
  description: string
  platform: string
}

const mockUserTickets: UserTicket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-056',
    subject: 'Unable to reset password',
    status: 'closed',
    createdAt: '2024-04-10',
    updatedAt: '2024-04-12',
    description: 'Password reset link not working',
    platform: 'Acme Corp Website',
  },
  {
    id: '2',
    ticketNumber: 'TKT-087',
    subject: 'Feature request: Export to CSV',
    status: 'in-progress',
    createdAt: '2024-04-15',
    updatedAt: '2024-04-20',
    description: 'Need ability to export data to CSV format',
    platform: 'Mobile App',
  },
  {
    id: '3',
    ticketNumber: 'TKT-092',
    subject: 'Dashboard loading slowly',
    status: 'open',
    createdAt: '2024-04-20',
    updatedAt: '2024-04-20',
    description: 'Dashboard takes 10+ seconds to load',
    platform: 'Acme Corp Website',
  },
]

export default function UserTickets() {
  const [tickets, setTickets] = useState<UserTicket[]>(mockUserTickets)
  const [open, setOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    platform: '',
  })

  const handleCreateTicket = () => {
    if (newTicket.subject.trim() && newTicket.description.trim() && newTicket.platform) {
      const ticket: UserTicket = {
        id: Date.now().toString(),
        ticketNumber: `TKT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        subject: newTicket.subject,
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        description: newTicket.description,
        platform: newTicket.platform,
      }
      setTickets([ticket, ...tickets])
      setNewTicket({ subject: '', description: '', platform: '' })
      setOpen(false)
    }
  }

  const openTickets = tickets.filter((t) => t.status === 'open').length
  const closedTickets = tickets.filter((t) => t.status === 'closed').length

  return (
    <AppLayout userRole="user">
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              My Tickets
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your support requests and their status
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue and we&apos;ll help you right away
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-platform">Platform</Label>
                  <Select
                    value={newTicket.platform}
                    onValueChange={(value) =>
                      setNewTicket({ ...newTicket, platform: value })
                    }
                  >
                    <SelectTrigger id="ticket-platform">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acme-website">Acme Corp Website</SelectItem>
                      <SelectItem value="mobile-app">Mobile App</SelectItem>
                      <SelectItem value="api-docs">API Documentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-subject">Subject</Label>
                  <Input
                    id="ticket-subject"
                    placeholder="Brief description of your issue"
                    value={newTicket.subject}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, subject: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-description">Description</Label>
                  <Textarea
                    id="ticket-description"
                    placeholder="Provide detailed information about your issue"
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, description: e.target.value })
                    }
                    className="min-h-[120px]"
                  />
                </div>
                <Button onClick={handleCreateTicket} className="w-full">
                  Create Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Total Tickets
            </p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {tickets.length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Open
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {openTickets}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              In Progress
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {tickets.filter((t) => t.status === 'in-progress').length}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Resolved
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              {closedTickets}
            </p>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">All Tickets</h2>
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tickets yet</p>
              <Button variant="outline" className="mt-4">
                Create your first ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
