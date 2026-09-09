import {
  LuActivity,
  LuArrowUpRight,
  LuClock3,
  LuSparkles,
  LuTarget,
} from 'react-icons/lu'

import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DashboardQueryBoundary } from '@/components/dashboard/DashboardQueryBoundary'
import { HorizontalBarList } from '@/components/dashboard/HorizontalBarList'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { LeadQuickActions } from '@/components/dashboard/LeadQuickActions'
import { PipelineStatusControl } from '@/components/dashboard/PipelineStatusControl'
import { useDashboardContext } from '@/contexts/dashboard-context'
import type { DashboardLead } from '@/types/lead'
import {
  offerLabels,
  pipelineStatusLabels,
  priorityLabels,
  qualificationLabels,
} from '@/utils/lead-analytics'

const numberFormatter = new Intl.NumberFormat('pt-BR')

function OpportunityList({
  emptyLabel,
  leads,
}: {
  emptyLabel: string
  leads: DashboardLead[]
}) {
  if (!leads.length) return <p className="insight-empty">{emptyLabel}</p>

  return (
    <div className="opportunity-work-list">
      {leads.map((lead) => (
        <article className="opportunity-work-item" key={lead.id}>
          <div className="opportunity-work-item__title">
            <div>
              <strong>{lead.business_name}</strong>
              <span>{[lead.city, lead.neighborhood].filter(Boolean).join(' · ') || 'Local não informado'}</span>
            </div>
            <span className={`priority-badge priority-badge--${lead.priority}`}>
              {priorityLabels[lead.priority]}
            </span>
          </div>
          <div className="opportunity-work-item__meta">
            <span className="offer-pill">{offerLabels[lead.recommended_offer]}</span>
            <span className={`status-pill status-pill--${lead.pipeline_status}`}>
              {pipelineStatusLabels[lead.pipeline_status]}
            </span>
            <span>{lead.overall_score}/100</span>
          </div>
          <p>{lead.approach_angle ?? qualificationLabels[lead.qualification_status]}</p>
          {lead.next_action ? <small>Próxima ação: {lead.next_action}</small> : null}
          <div className="opportunity-work-item__actions">
            <LeadQuickActions lead={lead} />
            <PipelineStatusControl leadId={lead.id} status={lead.pipeline_status} />
          </div>
        </article>
      ))}
    </div>
  )
}

export function OpportunitiesPage() {
  const { analytics, filteredLeads } = useDashboardContext()
  const opportunities = filteredLeads.filter((lead) =>
    lead.pipeline_eligible
    && (lead.google_maps_opportunity || lead.website_opportunity || lead.dual_opportunity),
  )
  const pending = opportunities.filter((lead) => lead.pipeline_status === 'new')
  const initiated = opportunities.filter((lead) => lead.pipeline_status !== 'new')

  return (
    <>
      <section className="page-heading" aria-labelledby="opportunities-title">
        <div>
          <span className="eyebrow">Fila de trabalho</span>
          <h1 id="opportunities-title">Oportunidades</h1>
          <p>Priorize a próxima abordagem, use os atalhos de contato e mova cada lead no pipeline.</p>
        </div>
        <div className="page-heading__context">
          <span>Oportunidades no recorte</span>
          <strong>{numberFormatter.format(opportunities.length)}</strong>
        </div>
      </section>

      <DashboardQueryBoundary>
        <DashboardFilters />
        {opportunities.length ? (
          <>
            <section className="kpi-grid opportunity-kpis" aria-label="Indicadores de oportunidade">
              <KpiCard
                icon={<LuTarget />}
                label="Alta prioridade"
                value={numberFormatter.format(opportunities.filter((lead) => lead.priority === 'hot' || lead.priority === 'high').length)}
                helper="Leads de prioridade alta ou quente"
                tone="violet"
              />
              <KpiCard
                icon={<LuClock3 />}
                label="Pendentes"
                value={numberFormatter.format(pending.length)}
                helper="Aguardando a primeira movimentação"
                tone="teal"
              />
              <KpiCard
                icon={<LuActivity />}
                label="Já movimentadas"
                value={numberFormatter.format(initiated.length)}
                helper="Qualificadas, desqualificadas ou arquivadas"
                tone="blue"
              />
              <KpiCard
                icon={<LuSparkles />}
                label="Prontas para contato"
                value={numberFormatter.format(analytics.readyToContact)}
                helper="Elegíveis, novas e com telefone"
                tone="amber"
              />
            </section>

            <section className="opportunity-columns" aria-label="Listas de oportunidades por andamento">
              <article className="dashboard-card opportunity-column">
                <div className="dashboard-card__content">
                  <div className="card-heading">
                    <div><span className="card-kicker">Ação imediata</span><h2>Pendentes de abordagem</h2></div>
                    <span className="card-icon card-icon--violet"><LuClock3 /></span>
                  </div>
                  <p className="card-description">Novos leads elegíveis, ordenados por prioridade e score.</p>
                  <OpportunityList emptyLabel="Nenhuma oportunidade nova atende aos filtros atuais." leads={pending} />
                </div>
              </article>
              <article className="dashboard-card opportunity-column">
                <div className="dashboard-card__content">
                  <div className="card-heading">
                    <div><span className="card-kicker">Acompanhamento</span><h2>Já movimentadas</h2></div>
                    <span className="card-icon card-icon--teal"><LuArrowUpRight /></span>
                  </div>
                  <p className="card-description">Leads cujo status operacional já foi alterado manualmente.</p>
                  <OpportunityList emptyLabel="Nenhuma oportunidade já foi movimentada neste recorte." leads={initiated} />
                </div>
              </article>
            </section>

            <section className="insights-grid opportunities-insights" aria-label="Distribuição das oportunidades">
              <article className="dashboard-card"><div className="dashboard-card__content">
                <div className="card-heading"><div><span className="card-kicker">Pipeline</span><h2>Andamento da operação</h2></div><span className="card-icon card-icon--violet"><LuActivity /></span></div>
                <HorizontalBarList items={analytics.pipeline} total={analytics.total} />
              </div></article>
              <article className="dashboard-card"><div className="dashboard-card__content">
                <div className="card-heading"><div><span className="card-kicker">Oferta sugerida</span><h2>Demanda identificada</h2></div><span className="card-icon card-icon--blue"><LuTarget /></span></div>
                <HorizontalBarList items={analytics.offers} total={analytics.total} />
              </div></article>
            </section>
          </>
        ) : <DashboardEmptyState />}
      </DashboardQueryBoundary>
    </>
  )
}
