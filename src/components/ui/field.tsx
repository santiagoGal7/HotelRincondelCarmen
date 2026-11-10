import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const controlClass =
  'w-full border border-line bg-bg px-3 py-3 text-sm text-fg outline-none placeholder:text-muted'

export function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('grid gap-2 text-sm', className)}>
      <span className="font-medium">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="text-xs text-accent">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  )
}
