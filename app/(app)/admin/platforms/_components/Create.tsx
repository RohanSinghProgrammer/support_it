import React, { Dispatch, SetStateAction } from 'react'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface CreatePlatformValues {
    name: string
    description: string
}

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    values: CreatePlatformValues
    onValuesChange: (values: CreatePlatformValues) => void
    onCreate: () => void
}

const CreatePlatform = ({ open, setOpen, values, onValuesChange, onCreate }: Props) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Platform
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Platform</DialogTitle>
                    <DialogDescription>
                        Create a new platform for customer support
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input
                            id="platform-name"
                            placeholder="e.g., Acme Corp Website"
                            value={values.name}
                            onChange={(e) =>
                                onValuesChange({ ...values, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="platform-desc">Description</Label>
                        <Input
                            id="platform-desc"
                            placeholder="e.g., Main customer support portal"
                            value={values.description}
                            onChange={(e) =>
                                onValuesChange({ ...values, description: e.target.value })
                            }
                        />
                    </div>
                    <Button onClick={onCreate} className="w-full">
                        Add Platform
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePlatform
