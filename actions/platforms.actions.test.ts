import { beforeEach, describe, expect, it } from 'vitest'
import {
  __resetPlatformsActionsStore,
  createPlatform,
  deletePlatform,
  getAllPlatforms,
  getPlatformById,
  updatePlatform,
} from './platforms.actions'

describe('platforms.actions', () => {
  beforeEach(async () => {
    await __resetPlatformsActionsStore()
  })

  it('supports search and pagination in getAllPlatforms', async () => {
    const result = await getAllPlatforms({
      role: 'staff',
      search: 'app',
      page: 1,
      pageSize: 1,
    })

    expect(result.performedByRole).toBe('staff')
    expect(result.pagination.totalItems).toBe(1)
    expect(result.data[0]?.name).toBe('Mobile App')
  })

  it('creates and fetches a platform', async () => {
    const created = await createPlatform({
      role: 'admin',
      data: {
        name: 'Billing Portal',
        description: 'Customer invoice support',
      },
    })

    expect(created.data).not.toBeNull()

    const fetched = await getPlatformById({
      role: 'admin',
      id: created.data!.id,
    })

    expect(fetched.data?.name).toBe('Billing Portal')
  })

  it('updates and deletes a platform', async () => {
    const updated = await updatePlatform({
      role: 'admin',
      id: '1',
      data: {
        description: 'Updated platform description',
      },
    })

    expect(updated.data).not.toBeNull()
    expect(updated.data!.description).toBe('Updated platform description')

    const deleted = await deletePlatform({
      role: 'admin',
      id: '1',
    })

    expect(deleted.data?.id).toBe('1')

    const fetched = await getPlatformById({
      role: 'admin',
      id: '1',
    })

    expect(fetched.data).toBeNull()
  })
})
