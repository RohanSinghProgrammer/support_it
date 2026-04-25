'use client'

import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import { Search } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { DataPagination } from '@/components/data-pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CreateTicketDialog } from './_components/create-ticket-dialog'
import { mockUserTickets } from './_components/mock-tickets'
import { TicketCard } from './_components/ticket-card'
import { UserTicket } from './_components/types'

const USER_TICKETS_PAGE_SIZE = 4

export default function UserTickets() {
  const [tickets, setTickets] = useState<UserTicket[]>(mockUserTickets)
  const [open, setOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    platform: '',
  })
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

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim() || !newTicket.platform) {
      return
    }

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

    setTickets((currentTickets) => [ticket, ...currentTickets])
    setNewTicket({ subject: '', description: '', platform: '' })
    setOpen(false)
  }

  const filteredTickets = tickets.filter((ticket) =>
    [ticket.ticketNumber, ticket.subject, ticket.description, ticket.platform]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / USER_TICKETS_PAGE_SIZE))
  const currentPage = Math.min(Math.max(page, 1), totalPages)

  useEffect(() => {
    if (page !== currentPage) {
      void setTicketParams({ page: currentPage })
    }
  }, [currentPage, page, setTicketParams])

  const visibleTickets = filteredTickets.slice(
    (currentPage - 1) * USER_TICKETS_PAGE_SIZE,
    currentPage * USER_TICKETS_PAGE_SIZE
  )

  const openTickets = tickets.filter((ticket) => ticket.status === 'open').length
  const closedTickets = tickets.filter((ticket) => ticket.status === 'closed').length

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 max-md:flex-col">
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">My Tickets</h1>
          <p className="mt-2 text-muted-foreground">
            Track support requests, search older conversations, and open new tickets quickly.
          </p>
        </div>
        <CreateTicketDialog
          open={open}
          setOpen={setOpen}
          values={newTicket}
          onValuesChange={setNewTicket}
          onCreate={handleCreateTicket}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Total Tickets
            </p>
            <p className="mt-3 text-3xl font-bold text-foreground">{tickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Open
            </p>
            <p className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {openTickets}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              In Progress
            </p>
            <p className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">
              {tickets.filter((ticket) => ticket.status === 'in-progress').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Resolved
            </p>
            <p className="mt-3 text-3xl font-bold text-green-600 dark:text-green-400">
              {closedTickets}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground">All Tickets</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search by ticket number, subject, platform, or issue details.
            </p>
          </div>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search your tickets..."
              className="pl-10"
            />
          </div>
        </div>

        {visibleTickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 py-16 text-center">
            <p className="text-muted-foreground">No tickets found for the current search.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 max-sm:flex-col max-sm:items-start">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">Ticket results</p>
            <p className="text-sm text-muted-foreground">
              Showing {visibleTickets.length} of {filteredTickets.length} tickets
            </p>
          </div>
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              void setTicketParams({ page: nextPage })
            }}
          />
        </div>
      </div>
    </div>
  )
}
