'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface LogoutConfirmButtonProps {
  className?: string
  iconClassName?: string
  label?: string
  variant?: 'button' | 'ghost'
}

export function LogoutConfirmButton({
  className,
  iconClassName,
  label = 'Logout',
  variant = 'ghost',
}: LogoutConfirmButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const trigger =
    variant === 'button' ? (
      <button
        className={className}
        type="button"
      >
        <LogOut className={iconClassName} />
        <span>{label}</span>
      </button>
    ) : (
      <Button variant="ghost" className={cn("hover:bg-red-400!", className)}>
        <LogOut className={iconClassName} />
        <span className='max-md:hidden'>{label}</span>
      </Button>
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout from SupportIt?</DialogTitle>
          <DialogDescription>
            You will be signed out from the current session and taken back to the home page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              setOpen(false)
              router.push('/')
            }}
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
