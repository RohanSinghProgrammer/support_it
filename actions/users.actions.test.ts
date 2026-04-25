import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetUsersActionsStore,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from './users.actions'

describe('users.actions', () => {
  beforeEach(async () => {
    await __resetUsersActionsStore()
  })

  it('supports search, pagination, and filters in getAllUsers', async () => {
    const result = await getAllUsers({
      role: 'admin',
      search: 'ticketflow',
      page: 1,
      pageSize: 2,
      filters: {
        role: 'staff',
        status: 'active',
      },
    })

    expect(result.performedByRole).toBe('admin')
    expect(result.pagination.totalItems).toBe(2)
    expect(result.pagination.totalPages).toBe(1)
    expect(result.data.every((user) => user.role === 'staff' && user.status === 'active')).toBe(true)
  })

  it('creates and fetches a user', async () => {
    const created = await createUser({
      role: 'admin',
      data: {
        name: 'Nina Patel',
        email: 'nina@ticketflow.com',
        role: 'staff',
        status: 'active',
        ticketsAssigned: 3,
      },
    })

    expect(created.data).not.toBeNull()
    expect(created.data!.email).toBe('nina@ticketflow.com')

    const fetched = await getUserById({
      role: 'admin',
      id: created.data!.id,
    })

    expect(fetched.data?.name).toBe('Nina Patel')
  })

  it('updates and deletes a user', async () => {
    const updated = await updateUser({
      role: 'admin',
      id: '2',
      data: {
        status: 'inactive',
        ticketsAssigned: 11,
      },
    })

    expect(updated.data).not.toBeNull()
    expect(updated.data!.status).toBe('inactive')
    expect(updated.data!.ticketsAssigned).toBe(11)

    const deleted = await deleteUser({
      role: 'admin',
      id: '2',
    })

    expect(deleted.data?.id).toBe('2')

    const fetched = await getUserById({
      role: 'admin',
      id: '2',
    })

    expect(fetched.data).toBeNull()
  })
})
