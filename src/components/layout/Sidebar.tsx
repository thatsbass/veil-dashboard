import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart2, KeyRound, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/usage',     icon: BarChart2,       label: 'Usage'     },
  { to: '/keys',      icon: KeyRound,        label: 'API Keys'  },
  { to: '/billing',   icon: CreditCard,      label: 'Billing'   },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-[244px] flex-col bg-surface border-r border-[rgba(0,0,0,0.07)]">
      {/* Wordmark */}
      <div className="flex h-14 items-center px-5 border-b border-[rgba(0,0,0,0.06)]">
        <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
          veil<span className="text-accent-strong">.</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium transition-colors',
                isActive
                  ? 'bg-accent-soft text-accent-ink'
                  : 'text-ink-3 hover:bg-surface-2 hover:text-ink',
              )
            }
          >
            <Icon className="h-[15px] w-[15px] shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[rgba(0,0,0,0.06)] p-3">
        <a
          href="https://docs.veil.dev"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] text-ink-4 hover:text-ink-2 hover:bg-surface-2 transition-colors"
        >
          Docs
        </a>
      </div>
    </aside>
  )
}
