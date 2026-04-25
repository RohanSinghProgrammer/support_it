'use client'

import { createAuthClient } from 'better-auth/react'
import type { auth } from '@/lib/auth'

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    'http://localhost:3000',
})

export type AuthSession = typeof authClient.$Infer.Session
export type AuthSessionFromServer = typeof auth.$Infer.Session
