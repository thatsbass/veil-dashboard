import { CheckCircle2, XCircle } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { RecentRequest } from '@/types'
import { formatTimeAgo, formatTokens, formatUSD, formatLatency } from '@/lib/utils'

const TOOL_LABELS: Record<RecentRequest['tool'], string> = {
  'claude-code': 'Claude Code',
  codex:         'Codex',
  cursor:        'Cursor',
  aider:         'Aider',
  api:           'API',
}

interface RecentRequestsProps {
  requests: RecentRequest[]
}

export function RecentRequests({ requests }: RecentRequestsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Tool</TableHead>
          <TableHead>Key</TableHead>
          <TableHead className="text-right">Tokens</TableHead>
          <TableHead className="text-right">Saved</TableHead>
          <TableHead className="text-right">Latency</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.id}>
            <TableCell className="text-ink-4 num">{formatTimeAgo(req.timestamp)}</TableCell>
            <TableCell>
              <span className="text-[12.5px] font-medium text-ink-2">
                {TOOL_LABELS[req.tool]}
              </span>
            </TableCell>
            <TableCell>
              <span className="key-mono text-ink-3">{req.keyMasked}</span>
            </TableCell>
            <TableCell className="text-right num text-ink-3">
              {formatTokens(req.tokensIn)}→{formatTokens(req.tokensOut)}
            </TableCell>
            <TableCell className="text-right num text-veil-success font-medium">
              {formatUSD(req.savedUSD)}
            </TableCell>
            <TableCell className="text-right num text-ink-3">
              {formatLatency(req.latencyMs)}
            </TableCell>
            <TableCell className="text-right">
              {req.status === 'success' ? (
                <Badge variant="success" className="justify-end">
                  <CheckCircle2 className="h-3 w-3" />
                  {req.statusCode}
                </Badge>
              ) : (
                <Badge variant="error" className="justify-end">
                  <XCircle className="h-3 w-3" />
                  {req.statusCode}
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function RecentRequestsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 rounded bg-surface-2 animate-pulse" />
      ))}
    </div>
  )
}
