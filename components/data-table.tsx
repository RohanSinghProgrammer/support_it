'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchPlaceholder?: string
  searchableFields?: (keyof T)[]
  onRowClick?: (row: T) => void
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchableFields = [],
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T
    direction: 'asc' | 'desc'
  } | null>(null)

  // Filter data based on search term
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return searchableFields.some((field) => {
      const value = row[field]
      return String(value).toLowerCase().includes(term)
    })
  })

  // Sort data
  let sortedData = [...filteredData]
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchableFields.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header */}
            <thead>
              <tr className="border-b border-border bg-secondary">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-6 py-3 text-left font-semibold text-foreground',
                      column.width
                    )}
                  >
                    <button
                      onClick={() =>
                        column.sortable && handleSort(column.key)
                      }
                      className={cn(
                        'flex items-center gap-2 w-full',
                        column.sortable && 'cursor-pointer hover:opacity-70'
                      )}
                      disabled={!column.sortable}
                    >
                      <span>{column.label}</span>
                      {column.sortable && sortConfig?.key === column.key && (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                sortedData.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-b border-border transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-secondary'
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${row.id}-${String(column.key)}`}
                        className={cn(
                          'px-6 py-4 text-foreground',
                          column.width
                        )}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedData.length} of {data.length} results
      </div>
    </div>
  )
}
