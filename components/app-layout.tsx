import { Sidebar } from './sidebar'
import { MobileNav } from './mobile-nav'
import { Footer } from './footer'

interface AppLayoutProps {
  children: React.ReactNode
  userRole?: 'admin' | 'staff' | 'user'
}

export function AppLayout({ children, userRole = 'admin' }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar userRole={userRole} />
      </div>

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Navigation Header */}
        <div className="md:hidden sticky top-0 z-40 border-b border-border bg-card">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="font-semibold">TicketFlow</div>
            <MobileNav userRole={userRole} />
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
