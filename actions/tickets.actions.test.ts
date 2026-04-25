import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetTicketsActionsStore,
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
} from './tickets.actions'

describe('tickets.actions', () => {
  beforeEach(async () => {
    await __resetTicketsActionsStore()
  })

  it('supports search, pagination, and filters in getAllTickets', async () => {
    const result = await getAllTickets({
      role: 'staff',
      search: 'app',
      page: 1,
      pageSize: 2,
      filters: {
        status: 'open',
        priority: 'high',
        platform: 'all',
        assignedTo: 'all',
      },
    })

    expect(result.performedByRole).toBe('staff')
    expect(result.pagination.totalItems).toBe(1)
    expect(result.data[0]?.ticketNumber).toBe('TKT-001')
  })

  it('creates and fetches a ticket', async () => {
    const created = await createTicket({
      role: 'user',
      data: {
        subject: 'New issue',
        userEmail: 'new@customer.com',
        status: 'open',
        priority: 'low',
        platform: 'Mobile App',
        description: 'Something is broken',
        assignedTo: 'Alice Johnson',
      },
    })

    expect(created.data).not.toBeNull()
    expect(created.data!.ticketNumber.startsWith('TKT-')).toBe(true)

    const fetched = await getTicketById({
      role: 'staff',
      id: created.data!.id,
    })

    expect(fetched.data?.subject).toBe('New issue')
  })

  it('updates and deletes a ticket', async () => {
    const updated = await updateTicket({
      role: 'staff',
      id: '1',
      data: {
        status: 'closed',
        assignedTo: 'Bob Smith',
      },
    })

    expect(updated.data).not.toBeNull()
    expect(updated.data!.status).toBe('closed')
    expect(updated.data!.assignedTo).toBe('Bob Smith')

    const deleted = await deleteTicket({
      role: 'admin',
      id: '1',
    })

    expect(deleted.data?.id).toBe('1')

    const fetched = await getTicketById({
      role: 'admin',
      id: '1',
    })

    expect(fetched.data).toBeNull()
  })
})
