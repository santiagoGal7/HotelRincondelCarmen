import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const controlClass =
  'w-full rounded-[1.15rem_1.15rem_1.15rem_0.35rem] bg-bg px-4 py-3 text-sm text-fg shadow-[inset_0_0_0_1px_var(--line),0_0_0_1px_color-mix(in_srgb,var(--fg)_14%,transparent)] outline-none transition focus-visible:shadow-[inset_0_0_0_1px_var(--accent),0_0_0_1px_var(--accent)]'

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
