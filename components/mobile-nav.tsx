'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Menu,
  X,
  BarChart3,
  Ticket,
  Users,
  Settings,
  Zap,
  Code2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { ThemeToggle } from './theme-toggle'
import { LogoutConfirmButton } from './logout-confirm-button'

interface MobileNavProps {
  userRole?: 'admin' | 'staff' | 'user'
}

export function MobileNav({ userRole = 'admin' }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/platforms', label: 'Platforms', icon: Zap },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/embed-form', label: 'Embed Form', icon: Code2 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const staffLinks = [
    { href: '/staff/tickets', label: 'Tickets', icon: Ticket },
    { href: '/staff/embed-form', label: 'Embed Form', icon: Code2 },
    { href: '/staff/settings', label: 'Settings', icon: Settings },
  ]

  const userLinks = [
    { href: '/user/tickets', label: 'My Tickets', icon: Ticket },
  ]

  let links = adminLinks
  if (userRole === 'staff') links = staffLinks
  if (userRole === 'user') links = userLinks

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Ticket className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-semibold text-lg">SupportIt</span>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                        'hover:bg-secondary',
                        isActive
                          ? 'bg-accent text-accent-foreground font-semibold'
                          : 'text-foreground'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  </SheetClose>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-4">
            <ThemeToggle />
            <LogoutConfirmButton className="w-full justify-start gap-3" iconClassName="w-5 h-5" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
