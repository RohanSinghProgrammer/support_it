import { Footer } from '@/components/footer'
import HomeNav from '@/components/home-nav'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <section className="flex min-h-screen flex-col">
      <HomeNav />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <LoginForm />
      </div>
      <Footer />
    </section>
  )
}
