import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
} from 'recharts'
import { Activity, Zap, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { useMonthlyStats, useUsageBreakdowns, usePerformanceStats } from '@/hooks/useStats'
import { formatTokens, formatUSD, formatLatency, cn } from '@/lib/utils'

type Metric = 'requests' | 'tokens' | 'cost' | 'latency'

const METRICS: { key: Metric; label: string }[] = [
  { key: 'requests', label: 'Requests' },
  { key: 'tokens',   label: 'Tokens'   },
  { key: 'cost',     label: 'Cost'     },
  { key: 'latency',  label: 'Latency'  },
]

function UsageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-[320px] rounded bg-surface-2 animate-pulse" />
      <div className="h-[280px] rounded-[10px] bg-surface-2 animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[100px] rounded-[10px] bg-surface-2 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function Usage() {
  const [metric, setMetric] = useState<Metric>('requests')
  const { data: stats, isLoading } = useMonthlyStats()
  const { data: breakdowns } = useUsageBreakdowns()
  const { data: perf } = usePerformanceStats()

  if (isLoading) return <UsageSkeleton />

  const chartData = stats?.dailyBreakdown.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value:
      metric === 'requests' ? d.requests
      : metric === 'tokens'   ? d.tokens
      : metric === 'cost'     ? d.costUSD
      :                          0,
  })) ?? []

  function fmtValue(v: number) {
    if (metric === 'requests') return v.toLocaleString()
    if (metric === 'tokens') return formatTokens(v)
    if (metric === 'cost') return formatUSD(v)
    return formatLatency(v)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Usage</h1>
        <p className="mt-0.5 text-[13px] text-ink-3">Detailed breakdown of your API traffic.</p>
      </div>

      {/* KPI tiles */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatsCard title="Requests" value={stats.requestCount.toLocaleString()} icon={Activity} />
          <StatsCard title="Tokens" value={formatTokens(stats.tokensUsed)} icon={Zap} />
          <StatsCard title="Saved" value={formatUSD(stats.savedUSD)} subtitle={`${stats.savedPercent.toFixed(0)}% cheaper`} icon={DollarSign} />
          <StatsCard title="Avg latency" value={formatLatency(stats.avgLatencyMs)} icon={Clock} />
        </div>
      )}

      {/* Main chart */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wider font-medium text-ink-4">
              30-day trend
            </div>
            <div className="flex rounded-[7px] bg-surface-2 p-0.5">
              {METRICS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setMetric(key)}
                  className={cn(
                    'rounded-[5px] px-3 py-1 text-[12px] font-medium transition-colors',
                    metric === key
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-ink-3 hover:text-ink',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a2d2ff" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#a2d2ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: '#9aa0a6' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10.5, fill: '#9aa0a6' }} axisLine={false} tickLine={false} tickFormatter={fmtValue} width={48} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', fontSize: '12px', padding: '6px 10px' }}
                  formatter={(v: number) => [fmtValue(v), METRICS.find((m) => m.key === metric)?.label]}
                />
                <Area type="monotone" dataKey="value" stroke="#6fb5f5" strokeWidth={1.8} fill="url(#usageGrad)" dot={false} activeDot={{ r: 3.5, fill: '#fff', stroke: '#6fb5f5', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Breakdowns */}
      {breakdowns && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: 'By tool', items: breakdowns.byTool },
            { title: 'By endpoint', items: breakdowns.byEndpoint },
            { title: 'By key', items: breakdowns.byKey },
          ].map(({ title, items }) => (
            <Card key={title}>
              <CardContent className="p-5">
                <div className="mb-3 text-[11px] uppercase tracking-wider font-medium text-ink-4">
                  {title}
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex justify-between text-[12.5px]">
                        <span className="font-medium text-ink-2 truncate">{item.label}</span>
                        <span className="text-ink-4 num shrink-0 ml-2">{item.percent.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-2">
                        <div
                          className="h-1.5 rounded-full bg-accent-strong transition-all duration-500"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Performance */}
      {perf && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 text-[11px] uppercase tracking-wider font-medium text-ink-4">
                Latency
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'p50', value: formatLatency(perf.p50Ms), sub: 'median' },
                  { label: 'p95', value: formatLatency(perf.p95Ms), sub: 'slow tail' },
                  { label: 'p99', value: formatLatency(perf.p99Ms), sub: 'worst 1%' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="text-center">
                    <div className="text-[11px] uppercase tracking-wider text-ink-4 font-medium">{label}</div>
                    <div className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-ink num">{value}</div>
                    <div className="text-[11px] text-ink-4">{sub}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="mb-3 text-[11px] uppercase tracking-wider font-medium text-ink-4">
                Errors
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-[11px] uppercase tracking-wider text-ink-4 font-medium">Error rate</div>
                  <div className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-ink num">{perf.errorRate.toFixed(2)}%</div>
                  <div className="text-[11px] text-ink-4">of total</div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] uppercase tracking-wider text-veil-warning font-medium">429s</div>
                  <div className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-ink num">{perf.errors429}</div>
                  <div className="text-[11px] text-ink-4">rate limits</div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] uppercase tracking-wider text-veil-warning font-medium">5xx</div>
                  <div className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-ink num">{perf.errors5xx}</div>
                  <div className="text-[11px] text-ink-4">server errors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
