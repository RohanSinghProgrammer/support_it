'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CreatePlatform from '../platforms/_components/Create'
import EditPlatform from '../platforms/_components/Edit'
import Link from 'next/link'

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

export function PlatformsSection({ type }: { type: "page" | "component" }) {
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
        {type === "component" ? <div>
          <h2 className="text-2xl font-bold text-foreground">Platforms</h2>
          <p className="text-muted-foreground text-sm mt-1 hidden md:block">
            Manage software platforms for ticket submission
          </p>
        </div> : <div className='w-full'></div>}
        {type === "component" ? <Link href={"/admin/platforms"}><Button>  <Eye /> View All Platforms </Button></Link> : <CreatePlatform open={open} setOpen={setOpen} />}
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
              <EditPlatform open={open} setOpen={setOpen} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
