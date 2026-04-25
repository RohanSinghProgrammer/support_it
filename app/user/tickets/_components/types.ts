export type UserTicketStatus = 'open' | 'in-progress' | 'on-hold' | 'closed'

export interface UserTicket {
  id: string
  ticketNumber: string
  subject: string
  status: UserTicketStatus
  createdAt: string
  updatedAt: string
  description: string
  platform: string
}
