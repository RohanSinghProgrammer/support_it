'use client'

import Link from 'next/link'
import { Ticket } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutConfirmButton } from '@/components/logout-confirm-button'
import { Badge } from '@/components/ui/badge'

interface RoleNavbarProps {
  role: 'staff' | 'user'
}

const roleLabel = {
  staff: 'Staff Workspace',
  user: 'User Portal',
}

export function RoleNavbar({ role }: RoleNavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm">
            <Ticket className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">SupportIt</p>
            <p className="truncate text-sm text-muted-foreground">{roleLabel[role]}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LogoutConfirmButton
            className="gap-2 px-3"
            iconClassName="h-4 w-4"
          />
        </div>
      </div>
    </header>
  )
}
