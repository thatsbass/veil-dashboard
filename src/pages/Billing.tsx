import { useState } from 'react'
import { CreditCard, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CurrentPlan } from '@/components/billing/CurrentPlan'
import { PlanCard } from '@/components/billing/PlanCard'
import { UpgradeModal } from '@/components/billing/UpgradeModal'
import { useBillingPlan, useCustomerPortal } from '@/hooks/useBilling'
import { PLANS } from '@/types'
import type { PlanID } from '@/types'
import { cn } from '@/lib/utils'

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[180px] rounded-[10px] bg-surface-2 animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[320px] rounded-[10px] bg-surface-2 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function Billing() {
  const [annual, setAnnual] = useState(false)
  const [upgradePlan, setUpgradePlan] = useState<PlanID | null>(null)
  const { data: billing, isLoading, error } = useBillingPlan()
  const openPortal = useCustomerPortal()

  async function handleManage() {
    try {
      const { url } = await openPortal()
      window.location.href = url
    } catch {
      // portal not available (no stripe customer), ignore
    }
  }

  if (isLoading) return <BillingSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Billing</h1>
          <p className="mt-0.5 text-[13px] text-ink-3">Plan, usage, and what you're saving.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <FileText className="h-3.5 w-3.5" />
            Invoices
          </Button>
          <Button size="sm">
            <CreditCard className="h-3.5 w-3.5" />
            Payment method
          </Button>
        </div>
      </div>

      {/* Current plan */}
      {error ? (
        <Card>
          <CardContent className="p-5 text-[13px] text-veil-error">{error.message}</CardContent>
        </Card>
      ) : billing ? (
        <CurrentPlan billing={billing} onManage={handleManage} />
      ) : null}

      {/* Change plan */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-ink">Change plan</h2>
            <p className="text-[12.5px] text-ink-3">
              Flat monthly fee. You always get the gateway discount on top.
            </p>
          </div>
          <div className="flex rounded-[7px] bg-surface-2 p-0.5">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                'rounded-[5px] px-3 py-1.5 text-[12px] font-medium transition-colors',
                !annual ? 'bg-white text-ink shadow-sm' : 'text-ink-3',
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                'flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-[12px] font-medium transition-colors',
                annual ? 'bg-white text-ink shadow-sm' : 'text-ink-3',
              )}
            >
              Annual <span className="text-veil-success">−20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.values(PLANS) as typeof PLANS[PlanID][]).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlanId={billing?.current.id ?? 'free'}
              annual={annual}
              onSelect={(id) => setUpgradePlan(id)}
            />
          ))}
        </div>
      </div>

      {/* Enterprise */}
      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-[14px] font-semibold text-ink">Beyond Team</h3>
            <p className="text-[12.5px] text-ink-3">
              Enterprise commitments, dedicated capacity, on-prem deployment, custom contracts.
            </p>
          </div>
          <Button size="sm" className="shrink-0 ml-4">Book a call →</Button>
        </CardContent>
      </Card>

      <UpgradeModal
        planId={upgradePlan}
        annual={annual}
        open={!!upgradePlan}
        onClose={() => setUpgradePlan(null)}
      />
    </div>
  )
}
