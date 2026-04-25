'use server'

import { randomUUID } from 'node:crypto'
import type { ActionRole } from './users.actions'
import { dbQuery } from '@/lib/app-db'

export interface PlatformRecord {
  id: string
  name: string
  description: string
}

export interface GetAllPlatformsParams {
  role: ActionRole
  search?: string
  page?: number
  pageSize?: number
}

export interface CreatePlatformPayload {
  role: ActionRole
  data: Omit<PlatformRecord, 'id'> & { id?: string }
}

export interface UpdatePlatformPayload {
  role: ActionRole
  id: string
  data: Partial<Omit<PlatformRecord, 'id'>>
}

export interface DeletePlatformPayload {
  role: ActionRole
  id: string
}

export interface GetPlatformByIdPayload {
  role: ActionRole
  id: string
}

function normalizePagination(page = 1, pageSize = 10) {
  return {
    page: Math.max(1, page),
    pageSize: Math.max(1, pageSize),
  }
}

function mapPlatform(row: {
  id: string
  name: string
  description: string
}): PlatformRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
  }
}

export async function getAllPlatforms({
  role,
  search = '',
  page = 1,
  pageSize = 10,
}: GetAllPlatformsParams) {
  const normalized = normalizePagination(page, pageSize)
  const values: Array<string | number> = []
  const where: string[] = []

  if (search.trim()) {
    values.push(`%${search.trim().toLowerCase()}%`)
    where.push(`(LOWER(name) LIKE $${values.length} OR LOWER(description) LIKE $${values.length})`)
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const countResult = await dbQuery<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM platforms ${whereClause}`,
    values
  )

  values.push(normalized.pageSize)
  values.push((normalized.page - 1) * normalized.pageSize)

  const rows = await dbQuery<PlatformRecord>(
    `
      SELECT id, name, description
      FROM platforms
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `,
    values
  )

  const totalItems = Number(countResult.rows[0]?.count ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalItems / normalized.pageSize))

  return {
    data: rows.rows.map(mapPlatform),
    pagination: {
      page: Math.min(normalized.page, totalPages),
      pageSize: normalized.pageSize,
      totalItems,
      totalPages,
    },
    search,
    performedByRole: role,
  }
}

export async function getPlatformOptions({
  role,
  search = '',
  limit = 25,
}: {
  role: ActionRole
  search?: string
  limit?: number
}) {
  const result = await getAllPlatforms({
    role,
    search,
    page: 1,
    pageSize: limit,
  })

  return {
    data: result.data.map((platform) => ({
      value: platform.name,
      label: platform.name,
      description: platform.description,
    })),
    performedByRole: role,
  }
}

export async function getPlatformById({
  role,
  id,
}: GetPlatformByIdPayload): Promise<{
  data: PlatformRecord | null
  performedByRole: ActionRole
}> {
  const result = await dbQuery<PlatformRecord>(
    `SELECT id, name, description FROM platforms WHERE id = $1 LIMIT 1`,
    [id]
  )

  return {
    data: result.rows[0] ? mapPlatform(result.rows[0]) : null,
    performedByRole: role,
  }
}

export async function findPlatformByName({
  role,
  name,
}: {
  role: ActionRole
  name: string
}) {
  const result = await dbQuery<PlatformRecord>(
    `SELECT id, name, description FROM platforms WHERE LOWER(name) = LOWER($1) LIMIT 1`,
    [name]
  )

  return {
    data: result.rows[0] ? mapPlatform(result.rows[0]) : null,
    performedByRole: role,
  }
}

export async function createPlatform({
  role,
  data,
}: CreatePlatformPayload): Promise<{
  data: PlatformRecord
  performedByRole: ActionRole
}> {
  const id = data.id ?? randomUUID()
  const result = await dbQuery<PlatformRecord>(
    `
      INSERT INTO platforms (id, name, description, created_at, updated_at)
      VALUES ($1, $2, $3, now(), now())
      RETURNING id, name, description
    `,
    [id, data.name.trim(), data.description.trim()]
  )

  return {
    data: mapPlatform(result.rows[0]),
    performedByRole: role,
  }
}

export async function updatePlatform({
  role,
  id,
  data,
}: UpdatePlatformPayload): Promise<{
  data: PlatformRecord | null
  performedByRole: ActionRole
}> {
  const existing = await getPlatformById({ role, id })
  if (!existing.data) {
    return {
      data: null,
      performedByRole: role,
    }
  }

  const nextPlatform = {
    ...existing.data,
    ...data,
  }

  const result = await dbQuery<PlatformRecord>(
    `
      UPDATE platforms
      SET name = $2,
          description = $3,
          updated_at = now()
      WHERE id = $1
      RETURNING id, name, description
    `,
    [id, nextPlatform.name.trim(), nextPlatform.description.trim()]
  )

  return {
    data: result.rows[0] ? mapPlatform(result.rows[0]) : null,
    performedByRole: role,
  }
}

export async function deletePlatform({
  role,
  id,
}: DeletePlatformPayload): Promise<{
  data: PlatformRecord | null
  performedByRole: ActionRole
}> {
  const result = await dbQuery<PlatformRecord>(
    `
      DELETE FROM platforms
      WHERE id = $1
      RETURNING id, name, description
    `,
    [id]
  )

  return {
    data: result.rows[0] ? mapPlatform(result.rows[0]) : null,
    performedByRole: role,
  }
}
