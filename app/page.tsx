import Link from 'next/link'
import { BarChart3, Ticket, Users, Code2 } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Ticket className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">SupportIt</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost">Admin</Button>
            </Link>
            <Link href="/staff/tickets">
              <Button variant="ghost">Staff</Button>
            </Link>
            <Link href="/user/tickets">
              <Button variant="ghost">User</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            Professional Ticket Management SaaS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Streamline customer support with our modern, intuitive ticket management system.
            Built for teams that care about responsive support.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/embed/form?platform=Demo&software=Sample">
              <Button size="lg" className="gap-2">
                Try Embed Form
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button size="lg" variant="outline" className="gap-2">
                View Admin Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="rounded-lg border border-border bg-card p-8 hover:shadow-lg transition-shadow">
            <BarChart3 className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h3>
            <p className="text-muted-foreground">
              Comprehensive insights with real-time statistics, platform management, and staff
              administration all in one place.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 hover:shadow-lg transition-shadow">
            <Ticket className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Staff Portal
            </h3>
            <p className="text-muted-foreground">
              Efficient ticket management interface with advanced search, status tracking, and
              detailed slide-over views for quick response.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 hover:shadow-lg transition-shadow">
            <Code2 className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Embeddable Form
            </h3>
            <p className="text-muted-foreground">
              Drop-in ticket submission form with URL parameters for platform and software context.
              Perfect for customer-facing sites.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
