import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { StaffMember, StaffRole } from './types'

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  staffMember: StaffMember | null
  onUpdate: () => void
  onStaffChange: (staffMember: StaffMember | null) => void
}

const EditStaff = ({
  open,
  setOpen,
  staffMember,
  onUpdate,
  onStaffChange,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Edit the selected user details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-staff-name">Full Name</Label>
            <Input
              id="edit-staff-name"
              placeholder="e.g., John Doe"
              value={staffMember?.name ?? ''}
              onChange={(event) =>
                onStaffChange(
                  staffMember
                    ? { ...staffMember, name: event.target.value }
                    : staffMember
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-staff-email">Email</Label>
            <Input
              id="edit-staff-email"
              type="email"
              placeholder="john@ticketflow.com"
              value={staffMember?.email ?? ''}
              onChange={(event) =>
                onStaffChange(
                  staffMember
                    ? { ...staffMember, email: event.target.value }
                    : staffMember
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-staff-role">Role</Label>
            <Select
              value={staffMember?.role ?? 'staff'}
              onValueChange={(value) =>
                onStaffChange(
                  staffMember
                    ? { ...staffMember, role: value as StaffRole }
                    : staffMember
                )
              }
            >
              <SelectTrigger className='w-full' id="edit-staff-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">End User</SelectItem>
                <SelectItem value="staff">Support Staff</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onUpdate} className="w-full">
            Update User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditStaff
