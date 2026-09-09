import type { ReactNode } from 'react'
import { LuDatabase } from 'react-icons/lu'

import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { useDashboardContext } from '@/contexts/dashboard-context'
import { isSupabaseConfigured } from '@/lib/supabase'

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function DashboardQueryBoundary({ children }: { children: ReactNode }) {
  const { dashboardQuery } = useDashboardContext()

  if (dashboardQuery.isLoading) return <DashboardSkeleton />

  if (dashboardQuery.isError) {
    return (
      <div className="dashboard-message ui-message ui-message--error" role="alert">
        <strong>Não foi possível carregar a operação.</strong>{' '}
        {isSupabaseConfigured
          ? 'Verifique a tabela “leads”, a política de leitura (RLS) e tente novamente.'
          : 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no arquivo .env.local.'}
      </div>
    )
  }

  if (!dashboardQuery.isSuccess) return null

  return (
    <>
      {dashboardQuery.data.sampled ? (
        <div className="sample-notice" role="status">
          <LuDatabase /> A listagem exibe os{' '}
          {numberFormatter.format(dashboardQuery.data.leads.length)} leads mais prioritários
          de um total de {numberFormatter.format(dashboardQuery.data.total)}. As métricas gerais
          continuam sendo calculadas no banco.
        </div>
      ) : null}
      {children}
    </>
  )
}
