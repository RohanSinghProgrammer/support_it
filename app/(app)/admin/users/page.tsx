import React from 'react'
import { UsersSection } from '../_components/users-section'

const UsersPage = () => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          User Management
        </h1>
      </div>
      <UsersSection type="page" />
    </div>
  )
}

export default UsersPage
