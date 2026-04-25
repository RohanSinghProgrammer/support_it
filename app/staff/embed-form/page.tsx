import React from 'react'
import { EmbedFormGenerator } from '@/components/embed-form-generator'

const StaffEmbedFormPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          Embedded Form Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Generate the client-facing support form URL, preview it, and copy the embed code.
        </p>
      </div>

      <EmbedFormGenerator />
    </div>
  )
}

export default StaffEmbedFormPage
