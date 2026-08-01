import { useUser } from '@clerk/clerk-react'
import { Zap, Activity, Clock } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { SavingsCard } from '@/components/dashboard/SavingsCard'
import { TokenChart } from '@/components/dashboard/TokenChart'
import { RecentRequests, RecentRequestsSkeleton } from '@/components/dashboard/RecentRequests'
import { Card, CardContent } from '@/components/ui/card'
import { useMonthlyStats, useRecentRequests } from '@/hooks/useStats'
import { formatTokens, formatLatency } from '@/lib/utils'

const TOOLS = [
  {
    name: 'Claude Code',
    slug: 'claude',
    description: 'The Anthropic CLI',
    command: 'export ANTHROPIC_BASE_URL=https://api.veil.dev/v1\nexport ANTHROPIC_API_KEY=<your-veil-key>',
  },
  {
    name: 'Codex (OpenAI)',
    slug: 'codex',
    description: 'OpenAI CLI',
    command: 'export OPENAI_BASE_URL=https://api.veil.dev/v1\nexport OPENAI_API_KEY=<your-veil-key>',
  },
  {
    name: 'Cursor',
    slug: 'cursor',
    description: 'AI code editor',
    command: 'Settings → Models → OpenAI\nBase URL: https://api.veil.dev/v1\nAPI Key: <your-veil-key>',
  },
]

export default function Dashboard() {
  const { user } = useUser()
  const { data: stats, isLoading: statsLoading } = useMonthlyStats()
  const { data: requests, isLoading: reqLoading } = useRecentRequests()

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          {user?.firstName ? `Hey, ${user.firstName}.` : 'Dashboard'}
        </h1>
        <p className="mt-0.5 text-[13px] text-ink-3">Here's how Veil is working for you.</p>
      </div>

      {/* Hero savings — only when there's actual savings data */}
      {stats && stats.savedUSD > 0 && (
        <SavingsCard
          savedUSD={stats.savedUSD}
          savedPercent={stats.savedPercent}
          dailyBreakdown={stats.dailyBreakdown}
        />
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[110px] rounded-[10px] bg-surface-2 animate-pulse" />
          ))
        ) : (
          <>
            <StatsCard
              title="Requests"
              value={stats ? stats.requestCount.toLocaleString() : '—'}
              subtitle="this month"
              icon={Activity}
            />
            <StatsCard
              title="Tokens used"
              value={stats ? formatTokens(stats.tokensUsed) : '—'}
              subtitle={stats ? `of ${formatTokens(stats.tokenQuota)} quota` : ''}
              icon={Zap}
            />
            <StatsCard
              title="Avg latency"
              value={stats && stats.avgLatencyMs > 0 ? formatLatency(stats.avgLatencyMs) : '—'}
              subtitle="p50"
              icon={Clock}
            />
          </>
        )}
      </div>

      {/* Token chart — only when there's daily data */}
      {stats && stats.dailyBreakdown.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 text-[11px] uppercase tracking-wider font-medium text-ink-4">
              Tokens · 30 days
            </div>
            <TokenChart data={stats.dailyBreakdown} />
          </CardContent>
        </Card>
      )}

      {/* Tool setup cards */}
      <div>
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-4">
          Plug your key in
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TOOLS.map((tool) => (
            <Card key={tool.slug}>
              <CardContent className="p-4">
                <div className="font-medium text-[13.5px] text-ink">{tool.name}</div>
                <div className="mt-0.5 text-[12px] text-ink-4">{tool.description}</div>
                <pre className="mt-3 rounded-[7px] bg-surface-2 px-3 py-2.5 text-[11.5px] font-mono text-ink-2 leading-[1.6] overflow-x-auto whitespace-pre-wrap break-all">
                  {tool.command}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent requests */}
      <div>
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-4">
          Recent activity
        </h2>
        <Card>
          <CardContent className="p-0 pt-0">
            {reqLoading ? (
              <div className="p-5">
                <RecentRequestsSkeleton />
              </div>
            ) : requests && requests.length > 0 ? (
              <RecentRequests requests={requests} />
            ) : (
              <div className="px-5 py-10 text-center text-[13px] text-ink-4">
                No requests yet. Configure a tool above to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
