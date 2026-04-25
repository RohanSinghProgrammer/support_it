'use client'

import { useState } from 'react'
import { Plus, Trash2, Mail, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface StaffMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff'
  status: 'active' | 'inactive'
  ticketsAssigned: number
}

const mockStaff: StaffMember[] = [
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
]

export function StaffSection() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'staff' as const,
  })
  const [open, setOpen] = useState(false)

  const handleAddStaff = () => {
    if (newStaff.name.trim() && newStaff.email.trim()) {
      setStaff([
        ...staff,
        {
          id: Date.now().toString(),
          ...newStaff,
          status: 'active',
          ticketsAssigned: 0,
        },
      ])
      setNewStaff({ name: '', email: '', role: 'staff' })
      setOpen(false)
    }
  }

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Staff Management</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage support team members
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
              <DialogDescription>
                Invite a new team member to the support team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staff-name">Full Name</Label>
                <Input
                  id="staff-name"
                  placeholder="e.g., John Doe"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-email">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  placeholder="john@ticketflow.com"
                  value={newStaff.email}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-role">Role</Label>
                <Select
                  value={newStaff.role}
                  onValueChange={(value) =>
                    setNewStaff({
                      ...newStaff,
                      role: value as 'admin' | 'staff',
                    })
                  }
                >
                  <SelectTrigger id="staff-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Support Staff</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddStaff} className="w-full">
                Add Staff Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Table */}
      <DataTable<StaffMember>
        columns={[
          {
            key: 'name',
            label: 'Name',
            sortable: true,
          },
          {
            key: 'email',
            label: 'Email',
            sortable: true,
            render: (email) => (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{email}</span>
              </div>
            ),
          },
          {
            key: 'role',
            label: 'Role',
            render: (role) => (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="capitalize text-sm">
                  {role === 'admin' ? 'Admin' : 'Staff'}
                </span>
              </div>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (status) => (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
                }`}
              >
                {status === 'active' ? 'Active' : 'Inactive'}
              </span>
            ),
          },
          {
            key: 'ticketsAssigned',
            label: 'Tickets',
            sortable: true,
            render: (count) => <span className="font-semibold">{count}</span>,
          },
          {
            key: 'id',
            label: 'Actions',
            render: (_, row) => (
              <button
                onClick={() => handleDeleteStaff(row.id)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive"
                aria-label="Delete staff member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        data={staff}
        searchPlaceholder="Search staff by name or email..."
        searchableFields={['name', 'email']}
      />
    </div>
  )
}
