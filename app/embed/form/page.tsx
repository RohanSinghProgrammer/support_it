'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { EmbeddableForm } from './components/embeddable-form'

function EmbeddableFormContent() {
  const searchParams = useSearchParams()
  const platform = searchParams.get('platform') || 'Unknown'
  const software = searchParams.get('software') || 'General'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 md:p-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent mb-4">
            <span className="text-accent-foreground font-bold">?</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Support Request
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Get help from our support team
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden">
          <EmbeddableForm platform={platform} software={software} />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Built by{' '}
            <span className="font-semibold">Rohan Singh</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EmbedForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <EmbeddableFormContent />
    </Suspense>
  )
}
