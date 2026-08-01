import { useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'

const CRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/usage': 'Usage',
  '/keys': 'API Keys',
  '/billing': 'Billing',
}

export function Header() {
  const { pathname } = useLocation()
  const { user } = useUser()

  const label = CRUMBS[pathname] ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[rgba(0,0,0,0.07)] bg-white/90 px-6 backdrop-blur-sm">
      <span className="text-[13.5px] font-medium text-ink">{label}</span>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-[12.5px] text-ink-3">{user.primaryEmailAddress?.emailAddress}</span>
        )}
        <UserButton
          afterSignOutUrl="/login"
          appearance={{
            elements: {
              avatarBox: 'h-7 w-7',
            },
          }}
        />
      </div>
    </header>
  )
}
