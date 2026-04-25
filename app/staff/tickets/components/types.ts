export type TicketStatus = 'open' | 'in-progress' | 'on-hold' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface StaffTicket {
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
}
