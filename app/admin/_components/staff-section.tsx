'use client'

import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import Link from 'next/link'
import { Eye, Mail, Pencil, Search, Shield, Trash2, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { DataPagination } from '@/components/data-pagination'
import CreateStaff from '../staff/_components/Create'
import DeleteStaff from '../staff/_components/Delete'
import EditStaff from '../staff/_components/Edit'
import { mockStaff } from '../staff/_components/mock-staff'
import { StaffMember, StaffRole } from '../staff/_components/types'

const STAFF_PAGE_SIZE = 5

export function StaffSection({ type }: { type: 'page' | 'component' }) {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [newStaff, setNewStaff] = useState<{
    name: string
    email: string
    role: StaffRole
  }>({
    name: '',
    email: '',
    role: 'staff' as const,
  })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null)
  const [{ search, page }, setStaffParams] = useQueryStates({
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

  const filteredStaff = staff.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(activeSearch.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / STAFF_PAGE_SIZE))
  const currentPage = type === 'page' ? Math.min(Math.max(page, 1), totalPages) : 1

  useEffect(() => {
    if (type === 'page' && page !== currentPage) {
      void setStaffParams({ page: currentPage })
    }
  }, [currentPage, page, setStaffParams, type])

  useEffect(() => {
    if (type !== 'page' || searchInput === activeSearch) {
      return
    }

    const syncSearch = debounce((value: string) => {
      void setStaffParams({
        search: value || null,
        page: 1,
      })
    }, 350)

    syncSearch(searchInput)

    return () => {
      syncSearch.cancel()
    }
  }, [activeSearch, searchInput, setStaffParams, type])

  const visibleStaff =
    type === 'page'
      ? filteredStaff.slice((currentPage - 1) * STAFF_PAGE_SIZE, currentPage * STAFF_PAGE_SIZE)
      : filteredStaff.slice(0, 4)

  const handleCreateStaff = () => {
    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      return
    }

    setStaff((currentStaff) => [
      ...currentStaff,
      {
        id: Date.now().toString(),
        ...newStaff,
        status: 'active',
        ticketsAssigned: 0,
      },
    ])
    setNewStaff({ name: '', email: '', role: 'staff' })
    setCreateDialogOpen(false)
  }

  const handleEditClick = (member: StaffMember) => {
    setStaffToEdit(member)
    setEditDialogOpen(true)
  }

  const handleUpdateStaff = () => {
    if (!staffToEdit) {
      return
    }

    setStaff((currentStaff) =>
      currentStaff.map((member) =>
        member.id === staffToEdit.id ? staffToEdit : member
      )
    )
    setEditDialogOpen(false)
  }

  const handleDeleteClick = (member: StaffMember) => {
    setStaffToDelete(member)
    setDeleteDialogOpen(true)
  }

  const handleDeleteStaff = () => {
    if (!staffToDelete) {
      return
    }

    setStaff((currentStaff) =>
      currentStaff.filter((member) => member.id !== staffToDelete.id)
    )
    setDeleteDialogOpen(false)
    setStaffToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {type === 'component' ? (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Staff</h2>
              <p className="text-muted-foreground text-sm mt-1 hidden md:block">
                Manage support team members and workloads
              </p>
            </div>
            <Link href="/admin/staff">
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                View All Staff
              </Button>
            </Link>
          </>
        ) : (
          <div className="w-full flex gap-2 max-md:flex-col">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search staff by name or email..."
                className="pl-10"
              />
            </div>
            <div className="flex justify-end">
              <CreateStaff
                open={createDialogOpen}
                setOpen={setCreateDialogOpen}
                values={newStaff}
                onValuesChange={setNewStaff}
                onCreate={handleCreateStaff}
              />
            </div>
          </div>
        )}
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
            <div>
              <CardTitle className="text-lg">Team Directory</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track team roles, statuses, and assigned tickets.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredStaff.length} member{filteredStaff.length === 1 ? '' : 's'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Role
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-12 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Tickets
                  </TableHead>
                  <TableHead className="h-12 px-4 text-right text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <UserRound className="w-5 h-5" />
                        <p>No staff members found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleStaff.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/20">
                      <TableCell className="min-w-[180px] px-4 py-4">
                        <div className="font-medium text-foreground">{member.name}</div>
                      </TableCell>
                      <TableCell className="min-w-[220px] px-4 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{member.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge
                          variant="outline"
                        >
                          <Shield className="mr-1 h-3.5 w-3.5" />
                          {member.role === 'admin' ? 'Admin' : 'Staff'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge
                          variant="outline"
                        >
                          {member.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4 font-medium">
                        {member.ticketsAssigned}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(member)}
                            aria-label={`Edit ${member.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(member)}
                            aria-label={`Delete ${member.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {type === 'page' ? (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 max-sm:flex-col max-sm:items-start">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Staff results</p>
                <p className="text-sm text-muted-foreground">
                  Showing {visibleStaff.length} of {filteredStaff.length} staff members
                </p>
              </div>
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                  void setStaffParams({ page: nextPage })
                }}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <EditStaff
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        staffMember={staffToEdit}
        onUpdate={handleUpdateStaff}
        onStaffChange={setStaffToEdit}
      />

      <DeleteStaff
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        staffMember={staffToDelete}
        onConfirm={handleDeleteStaff}
      />
    </div>
  )
}
