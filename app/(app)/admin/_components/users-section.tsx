'use client'

import { useEffect, useState } from 'react'
import debounce from 'lodash.debounce'
import Link from 'next/link'
import {
  Eye,
  Mail,
  Pencil,
  Search,
  Shield,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const USERS_PAGE_SIZE = 5

export function UsersSection({ type }: { type: 'page' | 'component' }) {
  const [users, setUsers] = useState<StaffMember[]>(mockStaff)
  const [newUser, setNewUser] = useState<{
    name: string
    email: string
    role: StaffRole
  }>({
    name: '',
    email: '',
    role: 'staff',
  })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<StaffMember | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<StaffMember | null>(null)
  const [{ search, page, role }, setUserParams] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    role: parseAsString.withDefault('all'),
  })
  const activeSearch = type === 'page' ? search : ''
  const activeRole = type === 'page' ? role : 'all'
  const [searchInput, setSearchInput] = useState(activeSearch)

  useEffect(() => {
    if (type === 'page') {
      setSearchInput(activeSearch)
    }
  }, [activeSearch, type])

  const filteredUsers = users.filter((member) => {
    const matchesSearch = `${member.name} ${member.email}`
      .toLowerCase()
      .includes(activeSearch.toLowerCase())
    const matchesRole = activeRole === 'all' || member.role === activeRole

    return matchesSearch && matchesRole
  })

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PAGE_SIZE))
  const currentPage = type === 'page' ? Math.min(Math.max(page, 1), totalPages) : 1

  useEffect(() => {
    if (type === 'page' && page !== currentPage) {
      void setUserParams({ page: currentPage })
    }
  }, [currentPage, page, setUserParams, type])

  useEffect(() => {
    if (type !== 'page' || searchInput === activeSearch) {
      return
    }

    const syncSearch = debounce((value: string) => {
      void setUserParams({
        search: value || null,
        page: 1,
      })
    }, 350)

    syncSearch(searchInput)

    return () => {
      syncSearch.cancel()
    }
  }, [activeSearch, searchInput, setUserParams, type])

  const visibleUsers =
    type === 'page'
      ? filteredUsers.slice((currentPage - 1) * USERS_PAGE_SIZE, currentPage * USERS_PAGE_SIZE)
      : filteredUsers.slice(0, 4)

  const handleCreateUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      return
    }

    setUsers((currentUsers) => [
      ...currentUsers,
      {
        id: Date.now().toString(),
        ...newUser,
        status: 'active',
        ticketsAssigned: 0,
      },
    ])
    setNewUser({ name: '', email: '', role: 'staff' })
    setCreateDialogOpen(false)
  }

  const handleEditClick = (member: StaffMember) => {
    setUserToEdit(member)
    setEditDialogOpen(true)
  }

  const handleUpdateUser = () => {
    if (!userToEdit) {
      return
    }

    setUsers((currentUsers) =>
      currentUsers.map((member) =>
        member.id === userToEdit.id ? userToEdit : member
      )
    )
    setEditDialogOpen(false)
  }

  const handleDeleteClick = (member: StaffMember) => {
    setUserToDelete(member)
    setDeleteDialogOpen(true)
  }

  const handleDeleteUser = () => {
    if (!userToDelete) {
      return
    }

    setUsers((currentUsers) =>
      currentUsers.filter((member) => member.id !== userToDelete.id)
    )
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {type === 'component' ? (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Users</h2>
              <p className="text-muted-foreground text-sm mt-1 hidden md:block">
                Manage admins, staff members, and end users from one place.
              </p>
            </div>
            <Link href="/admin/users">
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                View All Users
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
                placeholder="Search users by name or email..."
                className="pl-10"
              />
            </div>
            <Select
              value={activeRole}
              onValueChange={(value) => {
                void setUserParams({ role: value, page: 1 })
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <CreateStaff
                open={createDialogOpen}
                setOpen={setCreateDialogOpen}
                values={newUser}
                onValuesChange={setNewUser}
                onCreate={handleCreateUser}
              />
            </div>
          </div>
        )}
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
            <div>
              <CardTitle className="text-lg">User Directory</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track account roles, statuses, and assigned ticket ownership.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'}
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
                {visibleUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Users className="w-5 h-5" />
                        <p>No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleUsers.map((member) => (
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
                        <Badge variant="outline">
                          <Shield className="mr-1 h-3.5 w-3.5" />
                          {member.role === 'admin'
                            ? 'Admin'
                            : member.role === 'staff'
                              ? 'Staff'
                              : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant="outline">
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
            <DataPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(nextPage) => {
                void setUserParams({ page: nextPage })
              }}
            />
          ) : null}
        </CardContent>
      </Card>

      <EditStaff
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        staffMember={userToEdit}
        onUpdate={handleUpdateUser}
        onStaffChange={setUserToEdit}
      />

      <DeleteStaff
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        staffMember={userToDelete}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}
