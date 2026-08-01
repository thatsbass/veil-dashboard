import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setClerkTokenFn } from '@/lib/api'

import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Usage from '@/pages/Usage'
import APIKeys from '@/pages/APIKeys'
import Billing from '@/pages/Billing'
import Activate from '@/pages/Activate'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Missing VITE_CLERK_PUBLISHABLE_KEY — create a .env.local file:\n\n' +
    'VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx\nVITE_API_URL=http://localhost:8080',
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
})

function ClerkTokenWirer() {
  const { getToken } = useAuth()
  useEffect(() => {
    setClerkTokenFn(() => getToken())
  }, [getToken])
  return null
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ClerkTokenWirer />
          <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/activate" element={<Activate />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/usage" element={<Usage />} />
                <Route path="/keys" element={<APIKeys />} />
                <Route path="/billing" element={<Billing />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
