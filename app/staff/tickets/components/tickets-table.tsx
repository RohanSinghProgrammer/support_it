'use client'

import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { TicketDetail } from './ticket-detail'

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

const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'TKT-001',
    subject: 'Login issues on mobile app',
    userEmail: 'john@example.com',
    status: 'open',
    priority: 'high',
    platform: 'Mobile App',
    createdAt: '2024-04-20',
    description: 'User unable to log in on iOS app after latest update',
    assignedTo: 'Alice Johnson',
  },
  {
    id: '2',
    ticketNumber: 'TKT-002',
    subject: 'API documentation unclear',
    userEmail: 'dev@company.com',
    status: 'in-progress',
    priority: 'medium',
    platform: 'API Documentation',
    createdAt: '2024-04-18',
    description: 'Authentication section needs more examples',
    assignedTo: 'Bob Smith',
  },
  {
    id: '3',
    ticketNumber: 'TKT-003',
    subject: 'Payment integration error',
    userEmail: 'merchant@store.com',
    status: 'closed',
    priority: 'high',
    platform: 'Acme Corp Website',
    createdAt: '2024-04-15',
    description: 'Stripe integration throwing 500 errors',
    assignedTo: 'Carol White',
  },
  {
    id: '4',
    ticketNumber: 'TKT-004',
    subject: 'Feature request: Dark mode',
    userEmail: 'user@example.com',
    status: 'on-hold',
    priority: 'low',
    platform: 'Mobile App',
    createdAt: '2024-04-10',
    description: 'Users requesting dark mode toggle in settings',
    assignedTo: 'Bob Smith',
  },
  {
    id: '5',
    ticketNumber: 'TKT-005',
    subject: 'Database performance issues',
    userEmail: 'admin@company.com',
    status: 'in-progress',
    priority: 'high',
    platform: 'API Documentation',
    createdAt: '2024-04-22',
    description: 'Queries taking too long during peak hours',
    assignedTo: 'Alice Johnson',
  },
]

export function TicketsTable() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)

  const updateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    )
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus })
    }
  }

  return (
    <>
      <DataTable<Ticket>
        columns={[
          {
            key: 'ticketNumber',
            label: 'Ticket ID',
            sortable: true,
            render: (value) => (
              <span className="font-semibold text-accent">{value}</span>
            ),
          },
          {
            key: 'subject',
            label: 'Subject',
            sortable: true,
          },
          {
            key: 'userEmail',
            label: 'User Email',
            sortable: true,
            render: (email) => <span className="text-sm">{email}</span>,
          },
          {
            key: 'platform',
            label: 'Platform',
            sortable: true,
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (status) => <StatusBadge status={status} />,
          },
          {
            key: 'priority',
            label: 'Priority',
            render: (priority) => (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  priority === 'high'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : priority === 'medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
          },
        ]}
        data={tickets}
        searchPlaceholder="Search tickets by ID, subject, or email..."
        searchableFields={['ticketNumber', 'subject', 'userEmail']}
        onRowClick={(ticket) => setSelectedTicket(ticket)}
      />

      {/* Ticket Detail Slide-over */}
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={updateTicketStatus}
        />
      )}
    </>
  )
}
