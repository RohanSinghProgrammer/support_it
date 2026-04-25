'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2, Ticket } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutConfirmButton } from '@/components/logout-confirm-button'
import { cn } from '@/lib/utils'

interface RoleNavbarProps {
  role: 'staff' | 'user'
}

const roleLabel = {
  staff: 'Staff Workspace',
  user: 'User Portal',
}

export function RoleNavbar({ role }: RoleNavbarProps) {
  const pathname = usePathname()
  const navLinks =
    role === 'staff'
      ? [
        { href: '/staff/tickets', label: 'Tickets', icon: Ticket },
        { href: '/staff/embed-form', label: 'Embed Form', icon: Code2 },
      ]
      : []

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm">
              <Ticket className="h-5 w-5" />
            </div>
            <div className="min-w-0 max-md:hidden">
              <p className="truncate text-base font-semibold text-foreground">SupportIt</p>
              <p className="truncate text-sm text-muted-foreground">{roleLabel[role]}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navLinks.length > 0 ? (
              <nav className="flex flex-wrap items-center gap-6 mr-6">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'inline-flex items-center gap-2 text-sm font-medium transition-colors border-b-2 pb-1',
                        isActive
                          ? 'border-primary text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className='max-md:hidden'>{link.label}</span>
                    </Link>
                  )
                })}
              </nav>
            ) : null}
            <ThemeToggle />
            <LogoutConfirmButton
              className="gap-2 px-3"
              iconClassName="h-4 w-4"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
