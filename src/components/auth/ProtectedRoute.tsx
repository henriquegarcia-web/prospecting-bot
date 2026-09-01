import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/contexts/auth-context'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="auth-loading" aria-label="Verificando sessão">
        <span className="auth-loading__mark" />
        <span>Verificando acesso...</span>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
