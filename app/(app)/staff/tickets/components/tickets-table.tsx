'use client'

import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import { ChevronRight, Mail, Search, Ticket } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { DataPagination } from '@/components/data-pagination'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TicketDetail } from './ticket-detail'
import { mockTickets } from './mock-tickets'
import { StaffTicket } from './types'

const STAFF_TICKETS_PAGE_SIZE = 5

const priorityBadgeClassName: Record<StaffTicket['priority'], string> = {
  high: 'rounded-full border-red-200 bg-red-50 px-3 py-1 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
  medium:
    'rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300',
  low: 'rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300',
}

export function TicketsTable() {
  const [selectedTicket, setSelectedTicket] = useState<StaffTicket | null>(null)
  const [tickets, setTickets] = useState<StaffTicket[]>(mockTickets)
  const [{ search, page }, setTicketParams] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  })
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    if (searchInput === search) {
      return
    }

    const syncSearch = debounce((value: string) => {
      void setTicketParams({
        search: value || null,
        page: 1,
      })
    }, 350)

    syncSearch(searchInput)

    return () => syncSearch.cancel()
  }, [search, searchInput, setTicketParams])

  const filteredTickets = tickets.filter((ticket) =>
    [
      ticket.ticketNumber,
      ticket.subject,
      ticket.userEmail,
      ticket.platform,
      ticket.assignedTo,
    ]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / STAFF_TICKETS_PAGE_SIZE))
  const currentPage = Math.min(Math.max(page, 1), totalPages)

  useEffect(() => {
    if (page !== currentPage) {
      void setTicketParams({ page: currentPage })
    }
  }, [currentPage, page, setTicketParams])

  const visibleTickets = filteredTickets.slice(
    (currentPage - 1) * STAFF_TICKETS_PAGE_SIZE,
    currentPage * STAFF_TICKETS_PAGE_SIZE
  )

  const updateTicketStatus = (ticketId: string, newStatus: StaffTicket['status']) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : ticket
      )
    )
    setSelectedTicket((currentTicket) =>
      currentTicket?.id === ticketId
        ? {
          ...currentTicket,
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0],
        }
        : currentTicket
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search tickets by ID, subject, email, or assignee..."
            className="pl-10 w-full"
          />
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
              <div>
                <CardTitle className="text-lg">Assigned tickets</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Click any row to open the full detail panel and update the status.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredTickets.length} ticket{filteredTickets.length === 1 ? '' : 's'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Ticket
                    </TableHead>
                    <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Requester
                    </TableHead>
                    <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Platform
                    </TableHead>
                    <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Priority
                    </TableHead>
                    <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Updated
                    </TableHead>
                    <TableHead className="h-12 px-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      View
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-36 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Ticket className="h-5 w-5" />
                          <p>No tickets found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="cursor-pointer hover:bg-muted/20"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <TableCell className="px-4 py-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-accent">{ticket.ticketNumber}</p>
                            <p className="font-medium text-foreground">{ticket.subject}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{ticket.userEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-muted-foreground">
                          {ticket.platform}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <StatusBadge status={ticket.status} />
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <Badge variant="outline" className={priorityBadgeClassName[ticket.priority]}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-muted-foreground">
                          {ticket.updatedAt}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex justify-end">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <DataPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(nextPage) => {
                void setTicketParams({ page: nextPage })
              }}
            />
          </CardContent>
        </Card>
      </div>

      {selectedTicket ? (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={updateTicketStatus}
        />
      ) : null}
    </>
  )
}
