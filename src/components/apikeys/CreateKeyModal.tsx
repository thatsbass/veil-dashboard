import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateAPIKey } from '@/hooks/useAPIKeys'
import type { NewAPIKey } from '@/types'

interface CreateKeyModalProps {
  open: boolean
  onClose: () => void
}

export function CreateKeyModal({ open, onClose }: CreateKeyModalProps) {
  const [name, setName] = useState('')
  const [createdKey, setCreatedKey] = useState<NewAPIKey | null>(null)
  const [copied, setCopied] = useState(false)
  const { mutate: createKey, isPending, error } = useCreateAPIKey()

  function handleCreate() {
    if (!name.trim()) return
    createKey(
      { name: name.trim() },
      {
        onSuccess: (key) => {
          setCreatedKey(key)
        },
      },
    )
  }

  function copyFullKey() {
    if (!createdKey) return
    navigator.clipboard.writeText(createdKey.fullKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleClose() {
    setName('')
    setCreatedKey(null)
    setCopied(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-[460px]">
        {!createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Give your key a name so you can identify where it's used.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="key-name">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g. production, ci-runner, my-laptop"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 rounded-[8px] bg-veil-error-bg px-3 py-2 text-[12.5px] text-veil-error">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error.message}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handleCreate}
                disabled={!name.trim() || isPending}
              >
                {isPending ? 'Creating…' : 'Create key'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Key created — copy it now</DialogTitle>
              <DialogDescription>
                This is the only time we'll show the full key. We only store a hash.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-[8px] bg-surface-2 border border-[rgba(0,0,0,0.07)] p-3">
              <p className="key-mono text-[12.5px] text-ink-2 break-all select-all">
                {createdKey.fullKey}
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-[8px] bg-veil-warning-bg px-3 py-2 text-[12.5px] text-veil-warning">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Copy this key now. It won't be shown again.
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleClose}>Done</Button>
              <Button variant="primary" onClick={copyFullKey}>
                {copied ? (
                  <><Check className="h-3.5 w-3.5" /> Copied!</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy key</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
