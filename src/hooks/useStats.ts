import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { MonthlyUsage, RecentRequest, PerformanceStats, UsageBreakdown } from '@/types'

interface UsageRaw {
  used_tokens: number
  quota_tokens: number
  percent: number
  resets_at: string
}

export function useMonthlyStats() {
  return useQuery<MonthlyUsage, Error>({
    queryKey: ['stats', 'monthly'],
    queryFn: () =>
      api.get<UsageRaw>('/api/usage').then((r) => ({
        tokensUsed:     r.data.used_tokens  ?? 0,
        tokenQuota:     r.data.quota_tokens ?? 0,
        requestCount:   0,
        costUSD:        0,
        savedUSD:       0,
        savedPercent:   0,
        periodStart:    new Date().toISOString(),
        periodEnd:      r.data.resets_at ?? new Date().toISOString(),
        avgLatencyMs:   0,
        dailyBreakdown: [],
      } satisfies MonthlyUsage)),
    staleTime: 30_000,
    retry: 2,
    refetchInterval: 30_000,
  })
}

interface RequestRecord {
  id: string
  provider: string
  format: string
  tokens_in: number
  tokens_out: number
  cost_usd: number
  latency_ms: number | null
  status: string
  created_at: string
}

function formatToTool(format: string): RecentRequest['tool'] {
  if (format === 'anthropic') return 'claude-code'
  if (format === 'responses') return 'codex'
  if (format === 'openai') return 'api'
  return 'api'
}

export function useRecentRequests(limit = 10) {
  return useQuery<RecentRequest[], Error>({
    queryKey: ['requests', 'recent', limit],
    queryFn: () =>
      api
        .get<{ requests: RequestRecord[] }>('/api/usage/history')
        .then((r) =>
          (r.data.requests ?? []).slice(0, limit).map((rec) => ({
            id:          rec.id,
            timestamp:   rec.created_at,
            tool:        formatToTool(rec.format),
            keyName:     '—',
            keyMasked:   '—',
            latencyMs:   rec.latency_ms ?? 0,
            tokensIn:    rec.tokens_in,
            tokensOut:   rec.tokens_out,
            savedUSD:    0,
            status:      rec.status === 'success' ? 'success' : 'error',
            statusCode:  rec.status === 'success' ? 200 : 500,
          } satisfies RecentRequest)),
        ),
    staleTime: 30_000,
    retry: 2,
    refetchInterval: 30_000,
  })
}

export function useUsageBreakdowns() {
  return useQuery<{
    byTool: UsageBreakdown[]
    byEndpoint: UsageBreakdown[]
    byKey: UsageBreakdown[]
  }, Error>({
    queryKey: ['stats', 'breakdowns'],
    queryFn: () =>
      api.get('/api/usage/breakdowns').then((r) => r.data as {
        byTool: UsageBreakdown[]
        byEndpoint: UsageBreakdown[]
        byKey: UsageBreakdown[]
      }),
    staleTime: 60_000,
    retry: 2,
  })
}

export function usePerformanceStats() {
  return useQuery<PerformanceStats, Error>({
    queryKey: ['stats', 'performance'],
    queryFn: () => api.get<PerformanceStats>('/api/usage/performance').then((r) => r.data),
    staleTime: 60_000,
    retry: 2,
  })
}
