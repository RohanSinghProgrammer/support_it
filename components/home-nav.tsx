import { Ticket } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

const HomeNav = () => {
    return (
        <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <span className="font-bold text-lg text-foreground">SupportIt</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="ghost">Register</Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default HomeNav
