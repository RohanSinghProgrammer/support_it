import React from 'react'
import { PlatformsSection } from '../_components/platforms-section'

const PlatformPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Platform
        </h1>
      </div>
      <PlatformsSection type='page' />
    </div>
  )
}

export default PlatformPage
