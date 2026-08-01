import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import type { DailyUsage } from '@/types'
import { formatTokens } from '@/lib/utils'

interface TokenChartProps {
  data: DailyUsage[]
}

export function TokenChart({ data }: TokenChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tokens: d.tokens,
    requests: d.requests,
  }))

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a2d2ff" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#a2d2ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10.5, fill: '#9aa0a6' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10.5, fill: '#9aa0a6' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatTokens}
            width={40}
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
            formatter={(v: number, name: string) => [
              name === 'tokens' ? formatTokens(v) : v.toLocaleString(),
              name === 'tokens' ? 'Tokens' : 'Requests',
            ]}
          />
          <Area
            type="monotone"
            dataKey="tokens"
            stroke="#6fb5f5"
            strokeWidth={1.8}
            fill="url(#tokenGrad)"
            dot={false}
            activeDot={{ r: 3.5, fill: '#fff', stroke: '#6fb5f5', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
