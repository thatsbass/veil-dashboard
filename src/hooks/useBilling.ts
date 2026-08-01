import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { PLANS } from '@/types'
import type { BillingPlan, PlanID } from '@/types'

interface PlanRaw {
  id: string
  price_usd: number
  token_quota: number
  max_api_keys: number
}

interface UsageRaw {
  used_tokens: number
  quota_tokens: number
  resets_at: string
}

export function useBillingPlan() {
  return useQuery<BillingPlan, Error>({
    queryKey: ['billing', 'plan'],
    queryFn: async () => {
      const [planRes, usageRes] = await Promise.all([
        api.get<PlanRaw>('/api/billing/plan'),
        api.get<UsageRaw>('/api/usage'),
      ])

      const raw = planRes.data
      const planId = (raw.id ?? 'free') as PlanID
      const plan = PLANS[planId] ?? {
        id:          planId,
        name:        planId.charAt(0).toUpperCase() + planId.slice(1),
        priceUSD:    raw.price_usd    ?? 0,
        tokenQuota:  raw.token_quota  ?? 0,
        maxAPIKeys:  raw.max_api_keys ?? 1,
      }

      const tokensUsed = usageRes.data.used_tokens ?? 0

      return {
        current:          plan,
        tokensUsed,
        tokensRemaining:  Math.max(0, plan.tokenQuota - tokensUsed),
        resetsAt:         usageRes.data.resets_at ?? new Date().toISOString(),
        stripeCustomerID: null,
      }
    },
    staleTime: 60_000,
    retry: 2,
  })
}

export function useCreateCheckoutSession() {
  return async (planId: string, annual: boolean): Promise<{ url: string }> => {
    const res = await api.post<{ url: string }>('/api/billing/upgrade', { plan: planId, annual })
    return res.data
  }
}

export function useCustomerPortal() {
  return async (): Promise<{ url: string }> => {
    const res = await api.post<{ url: string }>('/api/billing/portal')
    return res.data
  }
}
