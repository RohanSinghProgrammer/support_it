'use server'

import { randomUUID } from 'node:crypto'
import type { ActionRole } from './users.actions'
import { dbQuery } from '@/lib/app-db'
import { findPlatformByName } from './platforms.actions'

export type TicketStatus = 'open' | 'in-progress' | 'on-hold' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface TicketRecord {
  id: string
  ticketNumber: string
  subject: string
  userEmail: string
  status: TicketStatus
  priority: TicketPriority
  platform: string
  createdAt: string
  updatedAt: string
  description: string
  assignedTo: string
  requesterName?: string | null
  requesterUserId?: string | null
  assignedToUserId?: string | null
}

export interface TicketsFilters {
  status?: TicketStatus | 'all'
  priority?: TicketPriority | 'all'
  platform?: string | 'all'
  assignedTo?: string | 'all'
  requesterEmail?: string
  requesterUserId?: string
}

export interface GetAllTicketsParams {
  role: ActionRole
  search?: string
  page?: number
  pageSize?: number
  filters?: TicketsFilters
}

export interface CreateTicketPayload {
  role: ActionRole
  data: {
    subject: string
    description: string
    platform: string
    status: TicketStatus
    priority: TicketPriority
    userEmail: string
    assignedTo: string
    requesterName?: string
    requesterUserId?: string | null
    assignedToUserId?: string | null
  }
}

export interface UpdateTicketPayload {
  role: ActionRole
  id: string
  data: Partial<{
    subject: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    platform: string
    assignedTo: string
    assignedToUserId: string | null
  }>
}

export interface DeleteTicketPayload {
  role: ActionRole
  id: string
}

export interface GetTicketByIdPayload {
  role: ActionRole
  id: string
}

function normalizePagination(page = 1, pageSize = 10) {
  return {
    page: Math.max(1, page),
    pageSize: Math.max(1, pageSize),
  }
}

function formatDate(value: Date | string) {
  return new Date(value).toISOString().split('T')[0]
}

function mapTicket(row: {
  id: string
  ticket_number: string
  subject: string
  requester_email: string
  status: TicketStatus
  priority: TicketPriority
  platform_name: string
  created_at: Date | string
  updated_at: Date | string
  description: string
  assigned_to_name: string | null
  requester_name: string | null
  user_id: string | null
  assigned_to_user_id: string | null
}): TicketRecord {
  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    subject: row.subject,
    userEmail: row.requester_email,
    status: row.status,
    priority: row.priority,
    platform: row.platform_name,
    createdAt: formatDate(row.created_at),
    updatedAt: formatDate(row.updated_at),
    description: row.description,
    assignedTo: row.assigned_to_name ?? 'Unassigned',
    requesterName: row.requester_name,
    requesterUserId: row.user_id,
    assignedToUserId: row.assigned_to_user_id,
  }
}

async function getNextTicketNumber() {
  const result = await dbQuery<{ ticket_number: string | null }>(
    `SELECT ticket_number FROM tickets ORDER BY created_at DESC LIMIT 1`
  )
  const current = result.rows[0]?.ticket_number ?? 'TKT-000'
  const nextValue = Number(current.replace('TKT-', '')) + 1
  return `TKT-${String(nextValue).padStart(3, '0')}`
}

export async function getAllTickets({
  role,
  search = '',
  page = 1,
  pageSize = 10,
  filters,
}: GetAllTicketsParams) {
  const normalized = normalizePagination(page, pageSize)
  const values: Array<string | number> = []
  const where: string[] = []

  if (search.trim()) {
    values.push(`%${search.trim().toLowerCase()}%`)
    where.push(`
      (
        LOWER(t.ticket_number) LIKE $${values.length}
        OR LOWER(t.subject) LIKE $${values.length}
        OR LOWER(t.description) LIKE $${values.length}
        OR LOWER(t.requester_email) LIKE $${values.length}
        OR LOWER(t.platform_name) LIKE $${values.length}
        OR LOWER(COALESCE(assignee.name, '')) LIKE $${values.length}
      )
    `)
  }

  if (filters?.status && filters.status !== 'all') {
    values.push(filters.status)
    where.push(`t.status = $${values.length}`)
  }

  if (filters?.priority && filters.priority !== 'all') {
    values.push(filters.priority)
    where.push(`t.priority = $${values.length}`)
  }

  if (filters?.platform && filters.platform !== 'all') {
    values.push(filters.platform)
    where.push(`t.platform_name = $${values.length}`)
  }

  if (filters?.assignedTo && filters.assignedTo !== 'all') {
    values.push(filters.assignedTo)
    where.push(`COALESCE(assignee.name, 'Unassigned') = $${values.length}`)
  }

  if (filters?.requesterEmail) {
    values.push(filters.requesterEmail)
    where.push(`t.requester_email = $${values.length}`)
  }

  if (filters?.requesterUserId) {
    values.push(filters.requesterUserId)
    where.push(`t.user_id = $${values.length}`)
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const countResult = await dbQuery<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM tickets t
      LEFT JOIN "user" assignee ON assignee.id = t.assigned_to_user_id
      ${whereClause}
    `,
    values
  )

  values.push(normalized.pageSize)
  values.push((normalized.page - 1) * normalized.pageSize)

  const result = await dbQuery<{
    id: string
    ticket_number: string
    subject: string
    requester_email: string
    status: TicketStatus
    priority: TicketPriority
    platform_name: string
    created_at: Date
    updated_at: Date
    description: string
    assigned_to_name: string | null
    requester_name: string | null
    user_id: string | null
    assigned_to_user_id: string | null
  }>(
    `
      SELECT
        t.id,
        t.ticket_number,
        t.subject,
        t.requester_email,
        t.status,
        t.priority,
        t.platform_name,
        t.created_at,
        t.updated_at,
        t.description,
        assignee.name AS assigned_to_name,
        t.requester_name,
        t.user_id,
        t.assigned_to_user_id
      FROM tickets t
      LEFT JOIN "user" assignee ON assignee.id = t.assigned_to_user_id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `,
    values
  )

  const totalItems = Number(countResult.rows[0]?.count ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalItems / normalized.pageSize))

  return {
    data: result.rows.map(mapTicket),
    pagination: {
      page: Math.min(normalized.page, totalPages),
      pageSize: normalized.pageSize,
      totalItems,
      totalPages,
    },
    filters: {
      status: filters?.status ?? 'all',
      priority: filters?.priority ?? 'all',
      platform: filters?.platform ?? 'all',
      assignedTo: filters?.assignedTo ?? 'all',
      requesterEmail: filters?.requesterEmail,
      requesterUserId: filters?.requesterUserId,
    },
    search,
    performedByRole: role,
  }
}

export async function getTicketById({
  role,
  id,
}: GetTicketByIdPayload): Promise<{
  data: TicketRecord | null
  performedByRole: ActionRole
}> {
  const result = await dbQuery<{
    id: string
    ticket_number: string
    subject: string
    requester_email: string
    status: TicketStatus
    priority: TicketPriority
    platform_name: string
    created_at: Date
    updated_at: Date
    description: string
    assigned_to_name: string | null
    requester_name: string | null
    user_id: string | null
    assigned_to_user_id: string | null
  }>(
    `
      SELECT
        t.id,
        t.ticket_number,
        t.subject,
        t.requester_email,
        t.status,
        t.priority,
        t.platform_name,
        t.created_at,
        t.updated_at,
        t.description,
        assignee.name AS assigned_to_name,
        t.requester_name,
        t.user_id,
        t.assigned_to_user_id
      FROM tickets t
      LEFT JOIN "user" assignee ON assignee.id = t.assigned_to_user_id
      WHERE t.id = $1
      LIMIT 1
    `,
    [id]
  )

  return {
    data: result.rows[0] ? mapTicket(result.rows[0]) : null,
    performedByRole: role,
  }
}

export async function createTicket({
  role,
  data,
}: CreateTicketPayload): Promise<{
  data: TicketRecord
  performedByRole: ActionRole
}> {
  const id = randomUUID()
  const ticketNumber = await getNextTicketNumber()
  const platform = await findPlatformByName({ role, name: data.platform })

  const result = await dbQuery<{
    id: string
    ticket_number: string
    subject: string
    requester_email: string
    status: TicketStatus
    priority: TicketPriority
    platform_name: string
    created_at: Date
    updated_at: Date
    description: string
    assigned_to_name: string | null
    requester_name: string | null
    user_id: string | null
    assigned_to_user_id: string | null
  }>(
    `
      INSERT INTO tickets (
        id,
        ticket_number,
        subject,
        description,
        status,
        priority,
        requester_name,
        requester_email,
        platform_id,
        platform_name,
        user_id,
        assigned_to_user_id,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now())
      RETURNING
        id,
        ticket_number,
        subject,
        requester_email,
        status,
        priority,
        platform_name,
        created_at,
        updated_at,
        description,
        NULL::text AS assigned_to_name,
        requester_name,
        user_id,
        assigned_to_user_id
    `,
    [
      id,
      ticketNumber,
      data.subject.trim(),
      data.description.trim(),
      data.status,
      data.priority,
      data.requesterName?.trim() ?? null,
      data.userEmail.trim().toLowerCase(),
      platform.data?.id ?? null,
      data.platform.trim(),
      data.requesterUserId ?? null,
      data.assignedToUserId ?? null,
    ]
  )

  return {
    data: mapTicket(result.rows[0]),
    performedByRole: role,
  }
}

export async function updateTicket({
  role,
  id,
  data,
}: UpdateTicketPayload): Promise<{
  data: TicketRecord | null
  performedByRole: ActionRole
}> {
  const existing = await getTicketById({ role, id })
  if (!existing.data) {
    return { data: null, performedByRole: role }
  }

  const nextPlatformName = data.platform ?? existing.data.platform
  const platform = await findPlatformByName({ role, name: nextPlatformName })
  const assignedUserId =
    Object.prototype.hasOwnProperty.call(data, 'assignedToUserId')
      ? data.assignedToUserId ?? null
      : existing.data.assignedToUserId ?? null

  const result = await dbQuery<{
    id: string
    ticket_number: string
    subject: string
    requester_email: string
    status: TicketStatus
    priority: TicketPriority
    platform_name: string
    created_at: Date
    updated_at: Date
    description: string
    assigned_to_name: string | null
    requester_name: string | null
    user_id: string | null
    assigned_to_user_id: string | null
  }>(
    `
      UPDATE tickets t
      SET subject = $2,
          description = $3,
          status = $4,
          priority = $5,
          platform_id = $6,
          platform_name = $7,
          assigned_to_user_id = $8,
          updated_at = now()
      WHERE t.id = $1
      RETURNING
        t.id,
        t.ticket_number,
        t.subject,
        t.requester_email,
        t.status,
        t.priority,
        t.platform_name,
        t.created_at,
        t.updated_at,
        t.description,
        t.requester_name,
        t.user_id,
        t.assigned_to_user_id,
        (
          SELECT u.name
          FROM "user" u
          WHERE u.id = t.assigned_to_user_id
        ) AS assigned_to_name
    `,
    [
      id,
      (data.subject ?? existing.data.subject).trim(),
      (data.description ?? existing.data.description).trim(),
      data.status ?? existing.data.status,
      data.priority ?? existing.data.priority,
      platform.data?.id ?? null,
      nextPlatformName.trim(),
      assignedUserId,
    ]
  )

  return {
    data: result.rows[0] ? mapTicket(result.rows[0]) : null,
    performedByRole: role,
  }
}

export async function deleteTicket({
  role,
  id,
}: DeleteTicketPayload): Promise<{
  data: TicketRecord | null
  performedByRole: ActionRole
}> {
  const result = await dbQuery<{
    id: string
    ticket_number: string
    subject: string
    requester_email: string
    status: TicketStatus
    priority: TicketPriority
    platform_name: string
    created_at: Date
    updated_at: Date
    description: string
    assigned_to_name: string | null
    requester_name: string | null
    user_id: string | null
    assigned_to_user_id: string | null
  }>(
    `
      DELETE FROM tickets t
      WHERE t.id = $1
      RETURNING
        t.id,
        t.ticket_number,
        t.subject,
        t.requester_email,
        t.status,
        t.priority,
        t.platform_name,
        t.created_at,
        t.updated_at,
        t.description,
        t.requester_name,
        t.user_id,
        t.assigned_to_user_id,
        NULL::text AS assigned_to_name
    `,
    [id]
  )

  return {
    data: result.rows[0] ? mapTicket(result.rows[0]) : null,
    performedByRole: role,
  }
}
