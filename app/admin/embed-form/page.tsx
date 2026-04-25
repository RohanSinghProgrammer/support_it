import React from 'react'
import { EmbedFormGenerator } from '@/components/embed-form-generator'

const AdminEmbedFormPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Embedded Form Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Generate embeddable support form URLs and iframe snippets for client software.
        </p>
      </div>

      <EmbedFormGenerator />
    </div>
  )
}

export default AdminEmbedFormPage
