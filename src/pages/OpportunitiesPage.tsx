import {
  LuActivity,
  LuExternalLink,
  LuMapPin,
  LuSparkles,
  LuTarget,
} from 'react-icons/lu'

import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DashboardQueryBoundary } from '@/components/dashboard/DashboardQueryBoundary'
import { HorizontalBarList } from '@/components/dashboard/HorizontalBarList'
import { useDashboardContext } from '@/contexts/dashboard-context'
import { offerLabels } from '@/utils/lead-analytics'

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function OpportunitiesPage() {
  const { analytics, filteredLeads } = useDashboardContext()

  return (
    <>
      <section className="page-heading" aria-labelledby="opportunities-title">
        <div>
          <span className="eyebrow">Inteligência comercial</span>
          <h1 id="opportunities-title">Oportunidades comerciais</h1>
          <p>Priorize a abordagem com base no estágio do pipeline, na oferta indicada e no score de cada lead.</p>
        </div>
        <div className="page-heading__context">
          <span>Oportunidades no recorte</span>
          <strong>{numberFormatter.format(filteredLeads.length)}</strong>
        </div>
      </section>

      <DashboardQueryBoundary>
        <DashboardFilters />
        {filteredLeads.length ? (
          <section className="insights-grid">
            <article className="dashboard-card pipeline-card"><div className="dashboard-card__content">
              <div className="card-heading"><div><span className="card-kicker">Pipeline</span><h2>Momento da operação</h2></div><span className="card-icon card-icon--violet"><LuActivity /></span></div>
              <HorizontalBarList items={analytics.pipeline} total={analytics.total} />
            </div></article>

            <article className="dashboard-card offers-card"><div className="dashboard-card__content">
              <div className="card-heading"><div><span className="card-kicker">Oferta recomendada</span><h2>Onde está a demanda</h2></div><span className="card-icon card-icon--blue"><LuTarget /></span></div>
              <HorizontalBarList items={analytics.offers} total={analytics.total} />
            </div></article>

            <article className="dashboard-card opportunities-card"><div className="dashboard-card__content">
              <div className="card-heading"><div><span className="card-kicker">Atenção imediata</span><h2>Top oportunidades</h2></div><span className="card-icon card-icon--teal"><LuSparkles /></span></div>
              <div className="opportunity-list">
                {analytics.topOpportunities.map((lead, index) => (
                  <article className="opportunity-item" key={lead.id}>
                    <span className="opportunity-item__rank">{index + 1}</span>
                    <div className="opportunity-item__content">
                      <strong>{lead.business_name}</strong>
                      <span><LuMapPin /> {[lead.city, lead.state].filter(Boolean).join(', ') || 'Local não informado'}</span>
                      <small>{lead.recommended_offer ? offerLabels[lead.recommended_offer] : 'Oferta não definida'}</small>
                    </div>
                    <div className="opportunity-item__score"><strong>{lead.lead_priority_score ?? '—'}</strong><span>score</span></div>
                    {lead.google_maps_url ? <a href={lead.google_maps_url} target="_blank" rel="noreferrer" aria-label={`Abrir ${lead.business_name} no Google Maps`}><LuExternalLink /></a> : null}
                  </article>
                ))}
              </div>
            </div></article>
          </section>
        ) : <DashboardEmptyState />}
      </DashboardQueryBoundary>
    </>
  )
}
