'use client';
import { useState } from 'react'
import { Trash2, Eye, Search, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CreatePlatform from '../platforms/_components/Create'
import EditPlatform from '../platforms/_components/Edit'
import Link from 'next/link'
import DeletePlatform from '../platforms/_components/Delete'

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
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [platformToEdit, setPlatformToEdit] = useState<Platform | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [platformToDelete, setPlatformToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleEditClick = (platform: Platform) => {
    setPlatformToEdit(platform)
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setPlatformToDelete(id)
    setDeleteDialogOpen(true)
  }

  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    platform.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {type === "component" ? (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Platforms</h2>
              <p className="text-muted-foreground text-sm mt-1 hidden md:block">
                Manage software platforms for ticket submission
              </p>
            </div>
            <Link href={"/admin/platforms"}>
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                View All Platforms
              </Button>
            </Link>
          </>
        ) : (
          <div className="w-full max-md:flex-col flex gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search platforms by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full max-md:w-full"
              />
            </div>
            <div className="flex justify-end">
              <CreatePlatform open={open} setOpen={setOpen} />
            </div>
          </div>
        )}
      </div>

      {/* Platforms Grid */}
      {filteredPlatforms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No platforms found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlatforms.map((platform) => (
            <Card
              key={platform.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {platform.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {platform.description}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(platform.id)}
                    className="shrink-0 text-destructive hover:text-destructive"
                    aria-label="Delete platform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardFooter className="pt-2 pb-4">
                <div className="w-full">
                  <Button
                    variant="outline"
                    className="gap-2 w-full"
                    onClick={() => handleEditClick(platform)}
                  >
                    <Pen className="w-4 h-4" />
                    <span>Edit Platform</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <EditPlatform
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        platform={platformToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeletePlatform open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
    </div>
  )
}
