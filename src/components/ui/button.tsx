import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  arrow?: boolean
  magnetic?: boolean
  loading?: boolean
  inverse?: boolean
  asChild?: boolean
}

function moveMagnetic(event: MouseEvent<HTMLElement>) {
  const node = event.currentTarget
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!window.matchMedia('(pointer: fine)').matches) return
  const rect = node.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6
  node.style.setProperty('--mx', `${x.toFixed(2)}px`)
  node.style.setProperty('--my', `${y.toFixed(2)}px`)
}

function resetMagnetic(event: MouseEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--mx', '0px')
  event.currentTarget.style.setProperty('--my', '0px')
}

export function Button({
  variant = 'primary',
  size = 'md',
  arrow = false,
  magnetic = false,
  loading = false,
  inverse = false,
  asChild = false,
  className,
  children,
  disabled,
  onMouseMove,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        inverse && 'btn-inverse',
        magnetic && 'btn-magnetic',
        className,
      )}
      data-arrow={arrow ? '' : undefined}
      data-loading={loading ? '' : undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      onMouseMove={(event: MouseEvent<HTMLElement>) => {
        if (magnetic) moveMagnetic(event)
        onMouseMove?.(event as MouseEvent<HTMLButtonElement>)
      }}
      onMouseLeave={(event: MouseEvent<HTMLElement>) => {
        if (magnetic) resetMagnetic(event)
        onMouseLeave?.(event as MouseEvent<HTMLButtonElement>)
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}
