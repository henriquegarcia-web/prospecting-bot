import { LuSearch } from 'react-icons/lu'

import { useDashboardContext } from '@/contexts/dashboard-context'

export function DashboardEmptyState() {
  const { clearFilters, hasActiveFilters } = useDashboardContext()

  return (
    <section className="empty-state" aria-live="polite">
      <span><LuSearch /></span>
      <h2>Nenhum lead encontrado</h2>
      <p>Ajuste os filtros da operação para ampliar o recorte analisado.</p>
      {hasActiveFilters ? (
        <button className="ui-button ui-button--outlined" type="button" onClick={clearFilters}>
          Limpar filtros
        </button>
      ) : null}
    </section>
  )
}
