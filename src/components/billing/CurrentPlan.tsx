import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import type { BillingPlan } from '@/types'
import { formatTokens, formatDate, percentUsed } from '@/lib/utils'

interface CurrentPlanProps {
  billing: BillingPlan
  onManage: () => void
}

export function CurrentPlan({ billing, onManage }: CurrentPlanProps) {
  const pct = percentUsed(billing.tokensUsed, billing.current.tokenQuota)
  const isOverPace = pct > 75

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-medium text-ink-4">
              Current plan
            </div>
            <div className="mt-1.5 flex items-baseline gap-3">
              <span className="text-[28px] font-semibold tracking-[-0.022em] text-ink">
                {billing.current.name}
              </span>
              <span className="text-ink-3">
                ${billing.current.priceUSD}
                <span className="text-[12px]">/mo</span>
                {' · '}renews {formatDate(billing.resetsAt)}
              </span>
            </div>
            <p className="mt-2 text-[12.5px] text-ink-3">
              Includes {formatTokens(billing.current.tokenQuota)} tokens,{' '}
              {billing.current.maxAPIKeys} API keys.
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={onManage}>Manage subscription</Button>
              <Button size="sm" variant="ghost">Cancel</Button>
            </div>
          </div>

          <div className="sm:w-[280px] shrink-0">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-medium text-ink-4">
                  Tokens used
                </div>
                <div className="mt-1 text-[24px] font-semibold tracking-[-0.02em] text-ink num">
                  {formatTokens(billing.tokensUsed)}{' '}
                  <span className="text-[14px] font-medium text-ink-3">
                    / {formatTokens(billing.current.tokenQuota)}
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[12px] font-medium text-ink-2 border border-[rgba(0,0,0,0.07)]">
                {pct}% used
              </span>
            </div>
            <Progress value={pct} className="mt-3 h-2" />
            <div className="mt-2 flex justify-between text-[11px] text-ink-4">
              <span>Resets {formatDate(billing.resetsAt)}</span>
              {isOverPace && (
                <span className="text-veil-warning-ink font-medium">
                  At current pace: may run out early
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
