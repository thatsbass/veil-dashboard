import { useState } from 'react'
import { Copy, MoreHorizontal, Check } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RevokeKeyModal } from './RevokeKeyModal'
import type { APIKey } from '@/types'
import { formatDate, formatTimeAgo } from '@/lib/utils'

interface APIKeyListProps {
  keys: APIKey[]
}

export function APIKeyList({ keys }: APIKeyListProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<APIKey | null>(null)

  function copyKey(key: APIKey) {
    navigator.clipboard.writeText(key.maskedKey).then(() => {
      setCopied(key.id)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key) => (
            <TableRow
              key={key.id}
              className={key.environment === 'revoked' ? 'opacity-50' : ''}
            >
              <TableCell>
                <span className={`font-medium ${key.environment === 'revoked' ? 'line-through text-ink-4' : 'text-ink'}`}>
                  {key.name}
                </span>
              </TableCell>
              <TableCell>
                <span className="key-mono text-ink-3">{key.maskedKey}</span>
              </TableCell>
              <TableCell>
                {key.environment === 'live' ? (
                  <Badge variant="live">
                    <span className="h-1.5 w-1.5 rounded-full bg-veil-success" />
                    live
                  </Badge>
                ) : (
                  <Badge variant="revoked">
                    <span className="h-1.5 w-1.5 rounded-full bg-veil-error" />
                    revoked
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-ink-4 num text-[13px]">
                {formatDate(key.createdAt)}
              </TableCell>
              <TableCell className="text-ink-4 num text-[13px]">
                {key.lastUsed ? formatTimeAgo(key.lastUsed) : '—'}
              </TableCell>
              <TableCell>
                {key.environment === 'live' && (
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" onClick={() => copyKey(key)}>
                      {copied === key.id ? (
                        <><Check className="h-3 w-3" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3" /> Copy</>
                      )}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRevoking(key)}>
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {revoking && (
        <RevokeKeyModal
          apiKey={revoking}
          open={!!revoking}
          onClose={() => setRevoking(null)}
        />
      )}
    </>
  )
}

export function APIKeyListSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 rounded bg-surface-2 animate-pulse" />
      ))}
    </div>
  )
}
