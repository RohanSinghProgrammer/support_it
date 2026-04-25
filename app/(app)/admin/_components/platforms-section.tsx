'use client'

import { useEffect, useState, useTransition } from 'react'
import debounce from 'lodash.debounce'
import Link from 'next/link'
import { Eye, Pen, Search, Trash2 } from 'lucide-react'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { DataPagination } from '@/components/data-pagination'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import CreatePlatform from '../platforms/_components/Create'
import DeletePlatform from '../platforms/_components/Delete'
import EditPlatform, { Platform as EditablePlatform } from '../platforms/_components/Edit'
import {
  createPlatform,
  deletePlatform,
  getAllPlatforms,
  updatePlatform,
  type PlatformRecord,
} from '@/actions/platforms.actions'

const PLATFORMS_PAGE_SIZE = 2

export function PlatformsSection({ type }: { type: 'page' | 'component' }) {
  const [platforms, setPlatforms] = useState<PlatformRecord[]>([])
  const [open, setOpen] = useState(false)
  const [newPlatform, setNewPlatform] = useState({ name: '', description: '' })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [platformToEdit, setPlatformToEdit] = useState<EditablePlatform | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [platformToDelete, setPlatformToDelete] = useState<PlatformRecord | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [{ search, page }, setPlatformParams] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  })
  const activeSearch = type === 'page' ? search : ''
  const [searchInput, setSearchInput] = useState(activeSearch)

  useEffect(() => {
    if (type === 'page') {
      setSearchInput(activeSearch)
    }
  }, [activeSearch, type])

  const loadPlatforms = (searchValue: string, pageValue: number) => {
    startTransition(async () => {
      const result = await getAllPlatforms({
        role: 'admin',
        search: searchValue,
        page: type === 'page' ? pageValue : 1,
        pageSize: type === 'page' ? PLATFORMS_PAGE_SIZE : 3,
      })

      setPlatforms(result.data)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    })
  }

  useEffect(() => {
    loadPlatforms(activeSearch, page)
  }, [activeSearch, page, type])

  const currentPage = type === 'page' ? Math.min(Math.max(page, 1), totalPages) : 1

  useEffect(() => {
    if (type === 'page' && page !== currentPage) {
      void setPlatformParams({ page: currentPage })
    }
  }, [currentPage, page, setPlatformParams, type])

  useEffect(() => {
    if (type !== 'page' || searchInput === activeSearch) {
      return
    }

    const syncSearch = debounce((value: string) => {
      void setPlatformParams({
        search: value || null,
        page: 1,
      })
    }, 350)

    syncSearch(searchInput)

    return () => {
      syncSearch.cancel()
    }
  }, [activeSearch, searchInput, setPlatformParams, type])

  const handleCreatePlatform = () => {
    if (!newPlatform.name.trim() || !newPlatform.description.trim()) {
      return
    }

    startTransition(async () => {
      await createPlatform({
        role: 'admin',
        data: newPlatform,
      })

      setNewPlatform({ name: '', description: '' })
      setOpen(false)
      if (type === 'page') {
        void setPlatformParams({ page: 1 })
      }
      loadPlatforms(activeSearch, 1)
    })
  }

  const handleEditClick = (platform: PlatformRecord) => {
    setPlatformToEdit(platform)
    setEditDialogOpen(true)
  }

  const handleUpdatePlatform = () => {
    if (!platformToEdit) {
      return
    }

    startTransition(async () => {
      await updatePlatform({
        role: 'admin',
        id: platformToEdit.id,
        data: {
          name: platformToEdit.name,
          description: platformToEdit.description,
          icon: platformToEdit.icon,
        },
      })

      setEditDialogOpen(false)
      loadPlatforms(activeSearch, currentPage)
    })
  }

  const handleDeleteClick = (platform: PlatformRecord) => {
    setPlatformToDelete(platform)
    setDeleteDialogOpen(true)
  }

  const handleDeletePlatform = () => {
    if (!platformToDelete) {
      return
    }

    startTransition(async () => {
      await deletePlatform({
        role: 'admin',
        id: platformToDelete.id,
      })

      setDeleteDialogOpen(false)
      setPlatformToDelete(null)
      loadPlatforms(activeSearch, currentPage)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {type === 'component' ? (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Platforms</h2>
              <p className="mt-1 hidden text-sm text-muted-foreground md:block">
                Manage software platforms for ticket submission
              </p>
            </div>
            <Link href="/admin/platforms">
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                View All Platforms
              </Button>
            </Link>
          </>
        ) : (
          <div className="flex w-full gap-2 max-md:flex-col">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search platforms by name or description..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                disabled={isPending}
                className="w-full pl-10 pr-4 py-2"
              />
            </div>
            <div className="flex justify-end">
              <CreatePlatform
                open={open}
                setOpen={setOpen}
                values={newPlatform}
                onValuesChange={setNewPlatform}
                onCreate={handleCreatePlatform}
              />
            </div>
          </div>
        )}
      </div>

      {platforms.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No platforms found</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className="group border-border/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                      {platform.name}
                    </CardTitle>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(platform)}
                    className="shrink-0 text-destructive hover:text-destructive"
                    aria-label="Delete platform"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardFooter className="pb-4 pt-2">
                <div className="w-full">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleEditClick(platform)}
                  >
                    <Pen className="h-4 w-4" />
                    <span>Edit Platform</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {type === 'page' ? (
        <DataPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(nextPage) => {
            void setPlatformParams({ page: nextPage })
          }}
        />
      ) : null}

      <EditPlatform
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        platform={platformToEdit}
        onPlatformChange={setPlatformToEdit}
        onUpdate={handleUpdatePlatform}
      />

      <DeletePlatform
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        platformName={platformToDelete?.name}
        onConfirm={handleDeletePlatform}
      />

      {type === 'page' ? (
        <div className="rounded-xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-muted-foreground">
          Showing {platforms.length} of {totalItems} platforms
        </div>
      ) : null}
    </div>
  )
}
