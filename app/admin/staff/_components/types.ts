export type StaffRole = 'admin' | 'staff' | 'user'
export type StaffStatus = 'active' | 'inactive'

export interface StaffMember {
  id: string
  name: string
  email: string
  role: StaffRole
  status: StaffStatus
  ticketsAssigned: number
}
