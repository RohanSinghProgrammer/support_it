import React from 'react'
import { StaffSection } from '../_components/staff-section'

const StaffPage = () => {
    return (
        <div className="p-4 md:p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Staff Management
                </h1>
            </div>
            <StaffSection type="page" />
        </div>
    )
}

export default StaffPage
