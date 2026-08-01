import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: number
  trendLabel?: string
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, subtitle, trend, trendLabel, icon: Icon, className }: StatsCardProps) {
  const trendUp = trend !== undefined && trend > 0
  const trendDown = trend !== undefined && trend < 0

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="text-[11px] uppercase tracking-wider font-medium text-ink-4">{title}</div>
          <div className="rounded-[7px] bg-accent-soft p-1.5">
            <Icon className="h-3.5 w-3.5 text-accent-ink" />
          </div>
        </div>
        <div className="mt-3 text-[26px] font-semibold tracking-[-0.025em] text-ink leading-none num">
          {value}
        </div>
        {(subtitle || trend !== undefined) && (
          <div className="mt-2 flex items-center gap-1.5 text-[12px]">
            {trend !== undefined && (
              <span
                className={cn(
                  'font-medium',
                  trendUp && 'text-veil-success',
                  trendDown && 'text-veil-error',
                  !trendUp && !trendDown && 'text-ink-4',
                )}
              >
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
              </span>
            )}
            {subtitle && <span className="text-ink-4">{subtitle}</span>}
            {trendLabel && <span className="text-ink-4">{trendLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
