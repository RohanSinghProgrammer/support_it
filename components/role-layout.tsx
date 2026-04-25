import { Footer } from '@/components/footer'
import { RoleNavbar } from '@/components/role-navbar'

interface RoleLayoutProps {
  children: React.ReactNode
  role: 'staff' | 'user'
}

export function RoleLayout({ children, role }: RoleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <RoleNavbar role={role} />
      <main className="mx-auto min-h-[calc(100vh-73px)] max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
