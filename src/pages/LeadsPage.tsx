import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DashboardQueryBoundary } from '@/components/dashboard/DashboardQueryBoundary'
import { LeadsTable } from '@/components/dashboard/LeadsTable'
import { useDashboardContext } from '@/contexts/dashboard-context'

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function LeadsPage() {
  const { filteredLeads } = useDashboardContext()

  return (
    <>
      <section className="page-heading" aria-labelledby="leads-title">
        <div>
          <span className="eyebrow">Consulta e operação</span>
          <h1 id="leads-title">Base de leads</h1>
          <p>Filtre a base completa, use os contatos rápidos e abra o dossiê para consultar todos os dados disponíveis.</p>
        </div>
        <div className="page-heading__context">
          <span>Resultados</span>
          <strong>{numberFormatter.format(filteredLeads.length)}</strong>
        </div>
      </section>

      <DashboardQueryBoundary>
        <DashboardFilters />
        {filteredLeads.length ? (
          <section className="table-section" aria-label="Base completa de leads">
            <div className="section-heading">
              <div><span className="card-kicker">Base operacional</span><h2>Leads ordenados por score geral</h2><p>Abra um item para ver o dossiê completo ou mova o status diretamente na lista.</p></div>
              <span className="results-count">{numberFormatter.format(filteredLeads.length)} resultado{filteredLeads.length === 1 ? '' : 's'}</span>
            </div>
            <LeadsTable leads={filteredLeads} />
          </section>
        ) : <DashboardEmptyState />}
      </DashboardQueryBoundary>
    </>
  )
}
