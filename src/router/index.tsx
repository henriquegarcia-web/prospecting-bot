import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { NotFoundPage } from '@/pages/NotFoundPage'
import {
  LazyDashboardLayout,
  LazyLeadsPage,
  LazyLoginPage,
  LazyOpportunitiesPage,
  LazyOverviewPage,
} from '@/router/lazy-routes'

const routeFallback = (
  <main className="auth-loading" aria-label="Carregando página">
    <span className="auth-loading__mark" />
    <span>Carregando...</span>
  </main>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={routeFallback}>
        <ProtectedRoute>
          <LazyDashboardLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <LazyOverviewPage />,
      },
      {
        path: 'oportunidades',
        element: <LazyOpportunitiesPage />,
      },
      {
        path: 'leads',
        element: <LazyLeadsPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Suspense fallback={routeFallback}><LazyLoginPage /></Suspense>,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
