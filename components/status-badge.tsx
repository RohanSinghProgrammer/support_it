import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'open' | 'closed' | 'on-hold' | 'in-progress'
  className?: string
}

const statusConfig = {
  open: {
    label: 'Open',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  },
  'on-hold': {
    label: 'On Hold',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400 border border-slate-200 dark:border-slate-800',
  },
  closed: {
    label: 'Closed',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
