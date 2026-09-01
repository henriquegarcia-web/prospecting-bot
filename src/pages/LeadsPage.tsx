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
          <span className="eyebrow">Leitura detalhada</span>
          <h1 id="leads-title">Base de leads</h1>
          <p>Consulte e refine os leads ordenados pela prioridade calculada na base. Nenhuma alteração é feita nesta tela.</p>
        </div>
        <div className="page-heading__context">
          <span>Resultados</span>
          <strong>{numberFormatter.format(filteredLeads.length)}</strong>
        </div>
      </section>

      <DashboardQueryBoundary>
        <DashboardFilters />
        {filteredLeads.length ? (
          <section className="table-section" aria-label="Leads para curadoria">
            <div className="section-heading">
              <div><span className="card-kicker">Curadoria</span><h2>Leads priorizados</h2><p>Use os filtros para reduzir o recorte exibido.</p></div>
              <span className="results-count">{numberFormatter.format(filteredLeads.length)} resultado{filteredLeads.length === 1 ? '' : 's'}</span>
            </div>
            <LeadsTable leads={filteredLeads} />
          </section>
        ) : <DashboardEmptyState />}
      </DashboardQueryBoundary>
    </>
  )
}
