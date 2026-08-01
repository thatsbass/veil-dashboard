import { useState } from 'react'
import { Plus, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { APIKeyList, APIKeyListSkeleton } from '@/components/apikeys/APIKeyList'
import { CreateKeyModal } from '@/components/apikeys/CreateKeyModal'
import { useAPIKeys } from '@/hooks/useAPIKeys'

export default function APIKeys() {
  const [creating, setCreating] = useState(false)
  const { data: keys, isLoading, error } = useAPIKeys()

  const active = keys?.filter((k) => k.environment === 'live').length ?? 0
  const revoked = keys?.filter((k) => k.environment === 'revoked').length ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">API keys</h1>
          <p className="mt-0.5 text-[13px] text-ink-3">
            Authenticate requests through Veil. We show the full key once — store it safely.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" />
          Create key
        </Button>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 rounded-[10px] bg-accent-soft border border-accent/40 px-4 py-3">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent-ink" />
        <p className="text-[12.5px] text-accent-ink">
          <strong>Keys are masked.</strong> Once you leave the create screen, the full secret is gone — we only store a hash.
        </p>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <APIKeyListSkeleton />
          ) : error ? (
            <div className="px-5 py-10 text-center text-[13px] text-veil-error">
              {error.message}
            </div>
          ) : !keys?.length ? (
            <div className="px-5 py-14 text-center">
              <p className="text-[13.5px] font-medium text-ink">No keys yet</p>
              <p className="mt-1 text-[12.5px] text-ink-3">Create your first key to start using Veil.</p>
              <Button variant="primary" size="sm" className="mt-4" onClick={() => setCreating(true)}>
                <Plus className="h-3.5 w-3.5" />
                Create key
              </Button>
            </div>
          ) : (
            <APIKeyList keys={keys} />
          )}
        </CardContent>
      </Card>

      {/* Footer meta */}
      {keys && keys.length > 0 && (
        <p className="text-[12px] text-ink-4">
          {active} active · {revoked} revoked
        </p>
      )}

      <CreateKeyModal open={creating} onClose={() => setCreating(false)} />
    </div>
  )
}
