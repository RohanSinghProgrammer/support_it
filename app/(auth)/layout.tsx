import { redirectIfAuthenticated } from '@/lib/auth-helpers'

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await redirectIfAuthenticated()

  return children
}
