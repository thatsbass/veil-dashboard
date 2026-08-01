import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 text-ink-2 border border-[rgba(0,0,0,0.07)]',
        success: 'bg-veil-success-bg text-veil-success border border-veil-success/20',
        error: 'bg-veil-error-bg text-veil-error border border-veil-error/20',
        warning: 'bg-veil-warning-bg text-veil-warning border border-veil-warning/20',
        accent: 'bg-accent-soft text-accent-ink border border-accent/40',
        live: 'bg-veil-success-bg text-veil-success border border-veil-success/20',
        revoked: 'bg-veil-error-bg text-veil-error border border-veil-error/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
