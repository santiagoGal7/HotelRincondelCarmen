import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      variant: {
        accent: 'h-11 bg-accent px-5 text-accent-fg hover:opacity-90',
        solid: 'h-11 bg-fg px-5 text-bg hover:opacity-90',
        ghost: 'h-11 border border-line px-5 hover:bg-elev',
        quiet: 'h-auto px-0 underline-offset-4 hover:underline',
      },
    },
    defaultVariants: { variant: 'solid' },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant }), className)} {...props} />
}
