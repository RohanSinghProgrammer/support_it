import React, { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export interface Platform {
    id: string
    name: string
    description: string
    icon?: string
}

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    platform: Platform | null
    onPlatformChange: (platform: Platform | null) => void
    onUpdate: () => void
}

const EditPlatform = ({ open, setOpen, platform, onPlatformChange, onUpdate }: Props) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Platform</DialogTitle>
                    <DialogDescription>
                        Edit the selected platform for customer support
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input
                            id="platform-name"
                            placeholder="e.g., Acme Corp Website"
                            value={platform?.name ?? ''}
                            onChange={(e) =>
                                onPlatformChange(
                                    platform
                                        ? { ...platform, name: e.target.value }
                                        : platform
                                )
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="platform-desc">Description</Label>
                        <Input
                            id="platform-desc"
                            placeholder="e.g., Main customer support portal"
                            value={platform?.description ?? ''}
                            onChange={(e) =>
                                onPlatformChange(
                                    platform
                                        ? { ...platform, description: e.target.value }
                                        : platform
                                )
                            }
                        />
                    </div>
                    <Button onClick={onUpdate} className="w-full">
                        Update Platform
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditPlatform
