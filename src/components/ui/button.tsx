import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-surface-2 text-ink border border-[rgba(0,0,0,0.08)] hover:bg-[rgba(0,0,0,0.05)] shadow-sm',
        primary:
          'bg-accent text-accent-ink border border-accent-strong/40 hover:bg-accent-strong shadow-sm',
        ghost:
          'bg-transparent text-ink-3 hover:bg-surface-2 hover:text-ink border-transparent',
        destructive:
          'bg-veil-error text-white border border-veil-error/80 hover:bg-red-700',
        outline:
          'border border-[rgba(0,0,0,0.12)] bg-white text-ink hover:bg-surface-2',
        link: 'underline-offset-4 hover:underline text-ink-3 p-0 h-auto',
      },
      size: {
        sm: 'h-7 px-3 text-[12.5px]',
        default: 'h-8 px-4 text-sm',
        lg: 'h-10 px-5 text-sm',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
