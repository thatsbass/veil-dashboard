import { SignIn } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export default function Login() {
  const { isLoaded, isSignedIn } = useAuth()

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
            veil<span className="text-accent-strong">.</span>
          </h1>
          <p className="mt-1 text-[13px] text-ink-3">LLM gateway — sign in to continue</p>
        </div>
        <SignIn
          routing="hash"
          afterSignInUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: 'shadow-card rounded-[12px] overflow-hidden',
              card: 'shadow-none',
              headerTitle: 'text-ink font-semibold',
              headerSubtitle: 'text-ink-3',
              socialButtonsBlockButton:
                'border border-[rgba(0,0,0,0.10)] text-ink hover:bg-surface-2 rounded-[8px]',
              formButtonPrimary:
                'bg-accent text-accent-ink hover:bg-accent-strong rounded-[8px] shadow-none',
              formFieldInput:
                'border border-[rgba(0,0,0,0.10)] rounded-[8px] focus:ring-2 focus:ring-accent',
              footerActionLink: 'text-accent-ink hover:text-accent-strong',
            },
          }}
        />
      </div>
    </div>
  )
}
