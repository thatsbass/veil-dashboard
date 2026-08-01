import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SignIn, useAuth, useUser } from '@clerk/clerk-react'
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeviceActivation, useConfirmDevice } from '@/hooks/useActivate'

function CodeDisplay({ code }: { code: string }) {
  const [a, b] = [code.slice(0, 4), code.slice(4, 8)]
  
  return (
    <div className="flex items-center gap-2">
      {a.split('').map((ch, i) => (
        <div
          key={`a${i}`}
          className="flex h-14 w-12 items-center justify-center rounded-[10px] bg-surface-2 border border-[rgba(0,0,0,0.08)] text-[24px] font-bold tracking-[-0.01em] text-ink font-mono shadow-card"
        >
          {ch}
        </div>
      ))}
      <div className="h-px w-4 bg-ink-4" />
      {b.split('').map((ch, i) => (
        <div
          key={`b${i}`}
          className="flex h-14 w-12 items-center justify-center rounded-[10px] bg-surface-2 border border-[rgba(0,0,0,0.08)] text-[24px] font-bold tracking-[-0.01em] text-ink font-mono shadow-card"
        >
          {ch}
        </div>
      ))}
    </div>
  )
}

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [secs, setSecs] = useState(() => Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((s) => {
        if (s <= 0) { clearInterval(id); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <p className="text-[12.5px] text-ink-4">
      Expires in <span className="font-mono font-medium text-ink-2">{mm}:{ss}</span>
    </p>
  )
}

export default function Activate() {
  const [params] = useSearchParams()
  const userCode = params.get('user_code')
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { data: activation, isLoading, error: fetchError } = useDeviceActivation(userCode)
  const { mutate: confirm, isPending, error: confirmError, isSuccess, data: confirmResult } = useConfirmDevice()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-accent-strong border-t-transparent animate-spin" />
      </div>
    )
  }

  // Not signed in — show Clerk sign-in first
  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#fafafa] px-4">
        <div className="text-center">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
            veil<span className="text-accent-strong">.</span>
          </h1>
          <p className="mt-1 text-[13px] text-ink-3">Sign in to authorize this device</p>
        </div>
        <SignIn routing="hash" afterSignInUrl={`/activate?user_code=${userCode ?? ''}`} />
      </div>
    )
  }

  // Success state
  if (isSuccess && confirmResult?.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fafafa] px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-veil-success-bg">
          <CheckCircle2 className="h-7 w-7 text-veil-success" />
        </div>
        <div className="text-center">
          <h2 className="text-[18px] font-semibold text-ink">CLI activated</h2>
          <p className="mt-1 text-[13px] text-ink-3">You can close this tab and return to your terminal.</p>
        </div>
      </div>
    )
  }

  // Denied / error
  if (isSuccess && !confirmResult?.success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fafafa] px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-veil-error-bg">
          <XCircle className="h-7 w-7 text-veil-error" />
        </div>
        <div className="text-center">
          <h2 className="text-[18px] font-semibold text-ink">Request denied</h2>
          <p className="mt-1 text-[13px] text-ink-3">The device authorization was denied.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* Top bar */}
      <div className="flex h-14 items-center justify-between border-b border-[rgba(0,0,0,0.07)] bg-white px-6">
        <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
          veil<span className="text-accent-strong">.</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-veil-success-bg px-3 py-1 text-[12px] font-medium text-veil-success">
          <span className="h-1.5 w-1.5 rounded-full bg-veil-success" />
          CLI device flow
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px] rounded-[14px] bg-white shadow-popover p-8">
          <div className="inline-block rounded-full bg-surface-2 px-3 py-1 text-[11px] font-medium text-ink-3">
            Step 2 of 3 · Authorize
          </div>
          <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-ink">
            Lift the veil for this device?
          </h1>
          <p className="mt-1 text-[13px] text-ink-3">
            Make sure the code below matches the one your terminal is showing.
          </p>

          {isLoading && (
            <div className="mt-6 flex justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-accent-strong border-t-transparent animate-spin" />
            </div>
          )}

          {fetchError && (
            <div className="mt-6 flex items-start gap-2 rounded-[8px] bg-veil-error-bg px-3 py-3 text-[12.5px] text-veil-error">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {fetchError.message.includes('404') || fetchError.message.includes('invalid')
                ? 'Invalid or expired code. Check your terminal and try again.'
                : fetchError.message}
            </div>
          )}

          {activation && (
            <>
              <div className="mt-6 flex justify-center">
                <CodeDisplay code={activation.userCode} />
              </div>
              <div className="mt-3 flex justify-center">
                <Countdown expiresAt={activation.expiresAt} />
              </div>

              {/* Identity */}
              <div className="mt-5 flex items-center gap-3 rounded-[10px] bg-surface-2 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[12px] font-semibold text-accent-ink">
                  {(user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink truncate">
                    {user?.fullName}
                    <span className="ml-1 font-normal text-ink-3">· admin</span>
                  </div>
                  <div className="text-[12px] text-ink-4 truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-veil-success-bg px-2.5 py-0.5 text-[11px] font-medium text-veil-success shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-veil-success" />
                  Signed in
                </span>
              </div>

              {confirmError && (
                <div className="mt-3 rounded-[8px] bg-veil-error-bg px-3 py-2.5 text-[12.5px] text-veil-error">
                  {confirmError.message}
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => confirm({ userCode: activation.userCode, action: 'deny' })}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-[1.4]"
                  onClick={() => confirm({ userCode: activation.userCode, action: 'approve' })}
                  disabled={isPending}
                >
                  {isPending ? 'Authorizing…' : 'Authorize device →'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom notice */}
      <div className="py-4 text-center text-[12px] text-ink-4">
        Didn't start this?{' '}
        <button
          className="underline underline-offset-2 hover:text-ink transition-colors"
          onClick={() => confirm({ userCode: activation?.userCode ?? '', action: 'deny' })}
        >
          Deny &amp; rotate keys
        </button>
        {' '}· This authorization is tied to your IP &amp; user agent.
      </div>
    </div>
  )
}
