'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface Platform {
  id: string
  name: string
  description: string
  icon?: string
}

const mockPlatforms: Platform[] = [
  {
    id: '1',
    name: 'Acme Corp Website',
    description: 'Main customer support portal',
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'iOS and Android app support',
  },
  {
    id: '3',
    name: 'API Documentation',
    description: 'Developer support',
  },
]

export function PlatformsSection() {
  const [platforms, setPlatforms] = useState<Platform[]>(mockPlatforms)
  const [newPlatform, setNewPlatform] = useState({ name: '', description: '' })
  const [open, setOpen] = useState(false)

  const handleAddPlatform = () => {
    if (newPlatform.name.trim()) {
      setPlatforms([
        ...platforms,
        {
          id: Date.now().toString(),
          ...newPlatform,
        },
      ])
      setNewPlatform({ name: '', description: '' })
      setOpen(false)
    }
  }

  const handleDeletePlatform = (id: string) => {
    setPlatforms(platforms.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Platforms</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage software platforms for ticket submission
          </p>
        </div>
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
                  value={newPlatform.name}
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-desc">Description</Label>
                <Input
                  id="platform-desc"
                  placeholder="e.g., Main customer support portal"
                  value={newPlatform.description}
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, description: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddPlatform} className="w-full">
                Add Platform
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="rounded-lg border border-border bg-card p-6 hover:border-accent transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">
                  {platform.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {platform.description}
                </p>
              </div>
              <button
                onClick={() => handleDeletePlatform(platform.id)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive"
                aria-label="Delete platform"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
