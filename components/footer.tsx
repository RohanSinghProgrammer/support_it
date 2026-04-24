import { Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Branding */}
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-sm text-muted-foreground">
              Built by{' '}
              <span className="font-semibold text-foreground">Rohan Singh</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-secondary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-8 pt-8">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} TicketFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
