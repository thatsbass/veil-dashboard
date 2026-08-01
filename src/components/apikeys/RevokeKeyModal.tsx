import { AlertCircle } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRevokeAPIKey } from '@/hooks/useAPIKeys'
import type { APIKey } from '@/types'

interface RevokeKeyModalProps {
  apiKey: APIKey
  open: boolean
  onClose: () => void
}

export function RevokeKeyModal({ apiKey, open, onClose }: RevokeKeyModalProps) {
  const { mutate: revokeKey, isPending, error } = useRevokeAPIKey()

  function handleRevoke() {
    revokeKey(apiKey.id, { onSuccess: onClose })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Revoke "{apiKey.name}"?</DialogTitle>
          <DialogDescription>
            Any requests using <span className="key-mono">{apiKey.maskedKey}</span> will
            immediately stop working. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="flex items-center gap-2 rounded-[8px] bg-veil-error-bg px-3 py-2 text-[12.5px] text-veil-error">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error.message}
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button variant="destructive" onClick={handleRevoke} disabled={isPending}>
            {isPending ? 'Revoking…' : 'Revoke key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
