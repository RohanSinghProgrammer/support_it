import React, { Dispatch, SetStateAction } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { StaffRole } from './types'

interface CreateStaffValues {
  name: string
  email: string
  role: StaffRole
}

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  values: CreateStaffValues
  onValuesChange: (values: CreateStaffValues) => void
  onCreate: () => void
}

const CreateStaff = ({
  open,
  setOpen,
  values,
  onValuesChange,
  onCreate,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Create a new admin, staff, or user account
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full Name</Label>
            <Input
              id="staff-name"
              placeholder="e.g., John Doe"
              value={values.name}
              onChange={(event) =>
                onValuesChange({ ...values, name: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email</Label>
            <Input
              id="staff-email"
              type="email"
              placeholder="john@ticketflow.com"
              value={values.email}
              onChange={(event) =>
                onValuesChange({ ...values, email: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-role">Role</Label>
            <Select
              value={values.role}
              onValueChange={(value) =>
                onValuesChange({
                  ...values,
                  role: value as StaffRole,
                })
              }
            >
              <SelectTrigger className='w-full' id="staff-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">End User</SelectItem>
                <SelectItem value="staff">Support Staff</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onCreate} className="w-full">
            Add User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateStaff
