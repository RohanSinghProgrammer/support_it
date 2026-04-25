'use client'

import { Dispatch, SetStateAction } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NewTicketValues {
  subject: string
  description: string
  platform: string
}

interface CreateTicketDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  values: NewTicketValues
  onValuesChange: (values: NewTicketValues) => void
  onCreate: () => void
}

export function CreateTicketDialog({
  open,
  setOpen,
  values,
  onValuesChange,
  onCreate,
}: CreateTicketDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Describe your issue and we&apos;ll help you right away
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-platform">Platform</Label>
            <Select
              value={values.platform}
              onValueChange={(value) => onValuesChange({ ...values, platform: value })}
            >
              <SelectTrigger id="ticket-platform">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Acme Corp Website">Acme Corp Website</SelectItem>
                <SelectItem value="Mobile App">Mobile App</SelectItem>
                <SelectItem value="API Documentation">API Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-subject">Subject</Label>
            <Input
              id="ticket-subject"
              placeholder="Brief description of your issue"
              value={values.subject}
              onChange={(event) =>
                onValuesChange({ ...values, subject: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-description">Description</Label>
            <Textarea
              id="ticket-description"
              placeholder="Provide detailed information about your issue"
              value={values.description}
              onChange={(event) =>
                onValuesChange({ ...values, description: event.target.value })
              }
              className="min-h-[120px]"
            />
          </div>
          <Button onClick={onCreate} className="w-full">
            Create Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
