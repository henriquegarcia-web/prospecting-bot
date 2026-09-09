import {
  LuBadgeCheck,
  LuBuilding2,
  LuChevronRight,
  LuMessageCircle,
  LuPhone,
  LuTarget,
  LuUsers,
} from 'react-icons/lu'
import { Link } from 'react-router-dom'

import { DashboardQueryBoundary } from '@/components/dashboard/DashboardQueryBoundary'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { LeadQuickActions } from '@/components/dashboard/LeadQuickActions'
import { PipelineStatusControl } from '@/components/dashboard/PipelineStatusControl'
import { useDashboardContext } from '@/contexts/dashboard-context'
import { offerLabels, priorityLabels, qualificationLabels } from '@/utils/lead-analytics'

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function OverviewPage() {
  const { dashboardQuery } = useDashboardContext()
  const metrics = dashboardQuery.data?.metrics
  const queue = dashboardQuery.data?.queue ?? []

  return (
    <>
      <section className="page-heading" aria-labelledby="overview-title">
        <div>
          <span className="eyebrow">Central de trabalho</span>
          <h1 id="overview-title">Operação de prospecção</h1>
          <p>Visualize a fila priorizada, entre em contato em um clique e avance o lead no pipeline.</p>
        </div>
        <div className="page-heading__context">
          <span>Fila aguardando ação</span>
          <strong>{numberFormatter.format(metrics?.new_leads ?? 0)}</strong>
        </div>
      </section>

      <DashboardQueryBoundary>
        <section className="kpi-grid" aria-label="Indicadores principais da operação">
          <KpiCard
            icon={<LuBuilding2 />}
            label="Leads na base"
            value={numberFormatter.format(metrics?.total_leads ?? 0)}
            helper={`${numberFormatter.format(metrics?.eligible_leads ?? 0)} elegíveis para o pipeline`}
            tone="violet"
          />
          <KpiCard
            icon={<LuTarget />}
            label="Na fila"
            value={numberFormatter.format(metrics?.new_leads ?? 0)}
            helper="Elegíveis que ainda aguardam abordagem"
            tone="teal"
          />
          <KpiCard
            icon={<LuPhone />}
            label="Com telefone"
            value={numberFormatter.format(metrics?.contactable_leads ?? 0)}
            helper="Atalhos de ligação e WhatsApp disponíveis"
            tone="blue"
          />
          <KpiCard
            icon={<LuBadgeCheck />}
            label="Alta prioridade"
            value={numberFormatter.format((metrics?.hot_leads ?? 0) + (metrics?.high_leads ?? 0))}
            helper={`${numberFormatter.format(metrics?.hot_leads ?? 0)} leads com prioridade quente`}
            tone="amber"
          />
        </section>

        <section className="overview-route-grid" aria-label="Áreas da operação">
          <Link className="overview-route-card" to="/oportunidades">
            <span className="card-icon card-icon--violet"><LuTarget /></span>
            <div>
              <span className="card-kicker">Visualização</span>
              <h2>Oportunidades</h2>
              <p>Compare demanda de Maps e Website, as ofertas sugeridas e os maiores scores.</p>
            </div>
            <LuChevronRight aria-hidden="true" />
          </Link>
          <Link className="overview-route-card" to="/leads">
            <span className="card-icon card-icon--blue"><LuUsers /></span>
            <div>
              <span className="card-kicker">Execução</span>
              <h2>Base de leads</h2>
              <p>Filtre a base, abra o dossiê e atualize o status de cada oportunidade.</p>
            </div>
            <LuChevronRight aria-hidden="true" />
          </Link>
        </section>

        <section className="dashboard-card priority-queue" aria-labelledby="operation-queue-title">
          <div className="dashboard-card__content">
            <div className="card-heading">
              <div>
                <span className="card-kicker">Ação imediata</span>
                <h2 id="operation-queue-title">Fila pronta para abordagem</h2>
                <p className="card-description">Ordenada pelo banco: prioridade, score geral e data de entrada.</p>
              </div>
              <span className="card-icon card-icon--teal"><LuMessageCircle /></span>
            </div>
            {queue.length ? (
              <div className="operation-queue-list">
                {queue.map((lead, index) => (
                  <article className="operation-queue-item" key={lead.id}>
                    <span className="opportunity-item__rank">{index + 1}</span>
                    <div className="operation-queue-item__content">
                      <strong>{lead.business_name}</strong>
                      <span>{[lead.city, lead.neighborhood].filter(Boolean).join(' · ') || 'Local não informado'}</span>
                      <small>
                        {priorityLabels[lead.priority]} · {offerLabels[lead.recommended_offer]} · {qualificationLabels[lead.qualification_status]}
                      </small>
                      {lead.next_action ? <em>Próxima ação: {lead.next_action}</em> : null}
                    </div>
                    <div className="operation-queue-item__score">
                      <strong>{lead.overall_score}</strong>
                      <span>score geral</span>
                    </div>
                    <LeadQuickActions lead={lead} />
                    <PipelineStatusControl leadId={lead.id} status={lead.pipeline_status} />
                  </article>
                ))}
              </div>
            ) : <p className="insight-empty">Não há leads elegíveis aguardando abordagem no momento.</p>}
          </div>
        </section>
      </DashboardQueryBoundary>
    </>
  )
}
