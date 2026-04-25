'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import debounce from 'lodash.debounce'
import { Search } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { authClient } from '@/lib/auth-client'
import { DataPagination } from '@/components/data-pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createTicket, getAllTickets } from '@/actions/tickets.actions'
import { CreateTicketDialog } from './_components/create-ticket-dialog'
import { TicketCard } from './_components/ticket-card'
import { UserTicket } from './_components/types'

const USER_TICKETS_PAGE_SIZE = 4

export default function UserTickets() {
  const { data: session } = authClient.useSession()
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [open, setOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    platform: '',
  })
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [{ search, page }, setTicketParams] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  })
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const currentUserEmail = session?.user.email ?? 'user@example.com'

  const loadTickets = (searchValue: string, pageValue: number) => {
    startTransition(async () => {
      const result = await getAllTickets({
        role: 'user',
        search: searchValue,
        page: 1,
        pageSize: 100,
      })

      const ownTickets = result.data.filter((ticket) => ticket.userEmail === currentUserEmail)
      const totalOwnTickets = ownTickets.length
      const normalizedTotalPages = Math.max(1, Math.ceil(totalOwnTickets / USER_TICKETS_PAGE_SIZE))
      const normalizedPage = Math.min(Math.max(pageValue, 1), normalizedTotalPages)
      const startIndex = (normalizedPage - 1) * USER_TICKETS_PAGE_SIZE

      setTickets(
        ownTickets.slice(startIndex, startIndex + USER_TICKETS_PAGE_SIZE).map((ticket) => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          status: ticket.status,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          description: ticket.description,
          platform: ticket.platform,
        }))
      )
      setTotalPages(normalizedTotalPages)
      setTotalItems(totalOwnTickets)
    })
  }

  useEffect(() => {
    loadTickets(search, page)
  }, [currentUserEmail, page, search])

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

    startTransition(async () => {
      await createTicket({
        role: 'user',
        data: {
          subject: newTicket.subject,
          description: newTicket.description,
          platform: newTicket.platform,
          status: 'open',
          priority: 'medium',
          userEmail: currentUserEmail,
          assignedTo: 'Unassigned',
        },
      })

      setNewTicket({ subject: '', description: '', platform: '' })
      setOpen(false)
      void setTicketParams({ page: 1 })
      loadTickets(search, 1)
    })
  }

  const currentPage = Math.min(Math.max(page, 1), totalPages)

  useEffect(() => {
    if (page !== currentPage) {
      void setTicketParams({ page: currentPage })
    }
  }, [currentPage, page, setTicketParams])

  const openTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'open').length,
    [tickets]
  )
  const closedTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'closed').length,
    [tickets]
  )

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
            <p className="mt-3 text-3xl font-bold text-foreground">{totalItems}</p>
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
              disabled={isPending}
              className="pl-10"
            />
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 py-16 text-center">
            <p className="text-muted-foreground">No tickets found for the current search.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(nextPage) => {
            void setTicketParams({ page: nextPage })
          }}
        />
      </div>
    </div>
  )
}
