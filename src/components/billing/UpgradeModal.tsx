import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCreateCheckoutSession } from '@/hooks/useBilling'
import { PLANS } from '@/types'
import type { PlanID } from '@/types'

interface UpgradeModalProps {
  planId: PlanID | null
  annual: boolean
  open: boolean
  onClose: () => void
}

export function UpgradeModal({ planId, annual, open, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const createCheckout = useCreateCheckoutSession()

  if (!planId) return null
  const plan = PLANS[planId]

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const { url } = await createCheckout(planId!, annual)
      window.location.href = url
    } catch (e) {
      setError((e as Error).message)
      setLoading(false)
    }
  }

  const price = annual ? Math.round(plan.priceUSD * 0.8) : plan.priceUSD

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Upgrade to {plan.name}</DialogTitle>
          <DialogDescription>
            ${price}/mo {annual ? '(billed annually)' : '(billed monthly)'}. Cancel anytime.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-[8px] bg-veil-error-bg px-3 py-2 text-[12.5px] text-veil-error">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleUpgrade} disabled={loading}>
            {loading ? 'Redirecting…' : (
              <><ExternalLink className="h-3.5 w-3.5" /> Continue to checkout</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
