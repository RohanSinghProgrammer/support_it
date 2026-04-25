import { Footer } from '@/components/footer'
import HomeNav from '@/components/home-nav'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <section className="flex min-h-screen flex-col">
      <HomeNav />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <RegisterForm />
      </div>
      <Footer />
    </section>
  )
}
