'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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
      <Button variant="ghost" className={className}>
        <LogOut className={iconClassName} />
        <span>{label}</span>
      </Button>
    )

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout from SupportIt?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out from the current session and taken back to the home page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 text-white' onClick={() => router.push('/')}>
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
