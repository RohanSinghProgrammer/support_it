'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Ticket,
  Users,
  Zap,
  Code2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'
import { LogoutConfirmButton } from './logout-confirm-button'

interface SidebarProps {
  userRole?: 'admin' | 'staff' | 'user'
}

export function Sidebar({ userRole = 'admin' }: SidebarProps) {
  const pathname = usePathname()

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/platforms', label: 'Platforms', icon: Zap },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/embed-form', label: 'Embed Form', icon: Code2 },
  ]

  const staffLinks = [
    { href: '/staff/tickets', label: 'Tickets', icon: Ticket },
  ]

  const userLinks = [
    { href: '/user/tickets', label: 'My Tickets', icon: Ticket },
  ]

  let links = adminLinks
  if (userRole === 'staff') links = staffLinks
  if (userRole === 'user') links = userLinks

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Ticket className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">SupportIt</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-foreground hover:bg-secondary'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-4 flex gap-2">
        <LogoutConfirmButton
          variant="button"
          className="w-full flex items-center gap-3 px-4 py-1.5 rounded-lg hover:bg-secondary text-red-500 transition-colors border border-red-200 dark:border-red-700"
          iconClassName="size-4 text-red-500"
          label="Logout"
        />
        <ThemeToggle />
      </div>
    </aside>
  )
}
