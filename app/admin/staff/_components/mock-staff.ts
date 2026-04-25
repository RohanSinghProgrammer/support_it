import { StaffMember } from './types'

export const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@ticketflow.com',
    role: 'admin',
    status: 'active',
    ticketsAssigned: 12,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@ticketflow.com',
    role: 'staff',
    status: 'active',
    ticketsAssigned: 8,
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@ticketflow.com',
    role: 'staff',
    status: 'active',
    ticketsAssigned: 15,
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@ticketflow.com',
    role: 'staff',
    status: 'inactive',
    ticketsAssigned: 0,
  },
  {
    id: '5',
    name: 'Ethan Clark',
    email: 'ethan@ticketflow.com',
    role: 'staff',
    status: 'active',
    ticketsAssigned: 6,
  },
  {
    id: '6',
    name: 'Farah Khan',
    email: 'farah@ticketflow.com',
    role: 'admin',
    status: 'active',
    ticketsAssigned: 4,
  },
]
