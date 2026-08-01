export interface User {
  id: string
  email: string
  plan: Plan
  createdAt: string
}

export type PlanID = 'free' | 'starter' | 'pro' | 'team'

export interface Plan {
  id: PlanID
  name: string
  priceUSD: number
  tokenQuota: number
  maxAPIKeys: number
}

export const PLANS: Record<PlanID, Plan> = {
  free:    { id: 'free',    name: 'Free',    priceUSD: 0,  tokenQuota: 100_000,    maxAPIKeys: 1  },
  starter: { id: 'starter', name: 'Starter', priceUSD: 9,  tokenQuota: 2_000_000,  maxAPIKeys: 3  },
  pro:     { id: 'pro',     name: 'Pro',     priceUSD: 29, tokenQuota: 10_000_000, maxAPIKeys: 10 },
  team:    { id: 'team',    name: 'Team',    priceUSD: 99, tokenQuota: 50_000_000, maxAPIKeys: 50 },
}

export interface APIKey {
  id: string
  name: string
  maskedKey: string
  environment: 'live' | 'revoked'
  lastUsed: string | null
  createdAt: string
}

export interface NewAPIKey extends APIKey {
  fullKey: string
}

export interface MonthlyUsage {
  tokensUsed: number
  tokenQuota: number
  requestCount: number
  costUSD: number
  savedUSD: number
  savedPercent: number
  periodStart: string
  periodEnd: string
  avgLatencyMs: number
  dailyBreakdown: DailyUsage[]
}

export interface DailyUsage {
  date: string
  tokens: number
  requests: number
  costUSD: number
  savedUSD: number
}

export interface RecentRequest {
  id: string
  timestamp: string
  tool: 'claude-code' | 'codex' | 'cursor' | 'aider' | 'api'
  keyName: string
  keyMasked: string
  latencyMs: number
  tokensIn: number
  tokensOut: number
  savedUSD: number
  status: 'success' | 'error'
  statusCode: number
}

export interface BillingPlan {
  current: Plan
  tokensUsed: number
  tokensRemaining: number
  resetsAt: string
  stripeCustomerID: string | null
}

export interface DeviceActivation {
  userCode: string
  expiresAt: string
  deviceName?: string
  ipAddress?: string
}

export type Tool = 'claude-code' | 'codex' | 'cursor' | 'aider' | 'api'

export interface UsageBreakdown {
  label: string
  tokens: number
  requests: number
  percent: number
}

export interface PerformanceStats {
  p50Ms: number
  p95Ms: number
  p99Ms: number
  errorRate: number
  totalErrors: number
  errors429: number
  errors5xx: number
}
