import { Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Plan, PlanID } from '@/types'
import { formatTokens, cn } from '@/lib/utils'

const PLAN_FEATURES: Record<PlanID, string[]> = {
  free: [
    `${formatTokens(100_000)} tokens / month`,
    '1 API key',
    'Community support',
    'Basic caching',
  ],
  starter: [
    `${formatTokens(2_000_000)} tokens / month`,
    '3 API keys',
    'Email support',
    'Smart caching · ~40% hit rate',
  ],
  pro: [
    `${formatTokens(10_000_000)} tokens / month`,
    '10 API keys',
    '99.9% SLA · priority routing',
    'Spend caps per key',
    'Slack support',
  ],
  team: [
    `${formatTokens(50_000_000)} tokens / month`,
    '50 API keys',
    'Priority routing',
    'Dedicated support',
    'Custom contracts',
  ],
}

interface PlanCardProps {
  plan: Plan
  currentPlanId: PlanID
  annual: boolean
  onSelect: (planId: PlanID) => void
}

export function PlanCard({ plan, currentPlanId, annual, onSelect }: PlanCardProps) {
  const isCurrent = plan.id === currentPlanId
  const price = annual ? Math.round(plan.priceUSD * 0.8) : plan.priceUSD
  const features = PLAN_FEATURES[plan.id]

  const isUpgrade =
    (['free', 'starter', 'pro', 'team'] as PlanID[]).indexOf(plan.id) >
    (['free', 'starter', 'pro', 'team'] as PlanID[]).indexOf(currentPlanId)

  return (
    <Card className={cn('flex flex-col', isCurrent && 'ring-2 ring-accent-strong ring-offset-1')}>
      <CardContent className="flex flex-col flex-1 p-5">
        <h3 className="text-[15px] font-semibold text-ink">{plan.name}</h3>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-[26px] font-bold tracking-[-0.025em] text-ink num">
            ${price}
          </span>
          <span className="text-[13px] text-ink-3">/mo</span>
          {annual && plan.priceUSD > 0 && (
            <span className="ml-1 text-[11px] font-medium text-veil-success">−20%</span>
          )}
        </div>

        <ul className="mt-4 flex-1 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[12.5px] text-ink-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-veil-success" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5">
          {isCurrent ? (
            <Button size="sm" className="w-full" disabled>
              You're on this plan
            </Button>
          ) : isUpgrade ? (
            <Button size="sm" variant="primary" className="w-full" onClick={() => onSelect(plan.id)}>
              Upgrade to {plan.name} →
            </Button>
          ) : (
            <Button size="sm" className="w-full" onClick={() => onSelect(plan.id)}>
              {plan.id === 'free' ? 'Downgrade' : 'Contact sales'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
