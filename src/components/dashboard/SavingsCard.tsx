import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import type { DailyUsage } from '@/types'
import { formatUSD } from '@/lib/utils'

interface SavingsCardProps {
  savedUSD: number
  savedPercent: number
  dailyBreakdown: DailyUsage[]
}

export function SavingsCard({ savedUSD, savedPercent, dailyBreakdown }: SavingsCardProps) {
  const chartData = dailyBreakdown.map((d) => ({ date: d.date, saved: d.savedUSD }))

  return (
    <Card className="col-span-full">
      <CardContent className="p-6">
        <div className="mb-1 text-[11px] uppercase tracking-wider font-medium text-ink-4">
          Savings vs going direct
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[42px] font-bold tracking-[-0.03em] text-ink leading-none num">
              {formatUSD(savedUSD)}
            </div>
            <div className="mt-2 text-[13px] text-ink-3">
              <span className="font-medium text-veil-success">{savedPercent.toFixed(0)}% cheaper</span>
              {' '}than going direct this month
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[12px] text-ink-4">30-day trend</div>
          </div>
        </div>
        <div className="mt-4 h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a2d2ff" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#a2d2ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="saved"
                stroke="#6fb5f5"
                strokeWidth={1.6}
                fill="url(#savingsGrad)"
                dot={false}
                activeDot={{ r: 3.5, fill: '#fff', stroke: '#6fb5f5', strokeWidth: 2 }}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '6px 10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(v: number) => [formatUSD(v), 'saved']}
                labelFormatter={(l: string) => l}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
