'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { AlertCircle, LoaderCircle, Lock, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.8 3.1-4.4 3.1-7.5Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.6c-.9.6-2 .9-3.4.9-2.6 0-4.7-1.7-5.5-4H3.2v2.7A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.5 13.9a6 6 0 0 1 0-3.8V7.4H3.2a10 10 0 0 0 0 9.2l3.3-2.7Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.5 9.5 0 0 0 12 2 10 10 0 0 0 3.2 7.4l3.3 2.7c.8-2.3 2.9-4 5.5-4Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length >= 8 && !isSubmitting,
    [email, isSubmitting, password]
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/auth-redirect',
    })

    if (error) {
      setErrorMessage(error.message ?? 'Unable to log in. Please try again.')
      setIsSubmitting(false)
      return
    }

    router.push('/auth-redirect')
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage('')
      setIsGoogleLoading(true)
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/auth-redirect',
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Google sign-in is not available right now.'
      )
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-xl">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Login to continue into SupportIt</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-9"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-9"
            />
          </div>

          {errorMessage ? (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <Button type="submit" className="w-full gap-2" disabled={!canSubmit}>
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
          {isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New here?{' '}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
