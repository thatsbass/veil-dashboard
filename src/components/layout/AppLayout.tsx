import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className="flex h-screen bg-[#fafafa]">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-[244px] min-h-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1080px] px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
