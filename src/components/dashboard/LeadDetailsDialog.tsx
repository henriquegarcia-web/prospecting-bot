import { useEffect, useRef } from 'react'
import {
  LuBadgeCheck,
  LuChartBar,
  LuBuilding2,
  LuClipboardList,
  LuMapPin,
  LuSparkles,
  LuX,
} from 'react-icons/lu'

import { LeadQuickActions } from '@/components/dashboard/LeadQuickActions'
import { PipelineStatusControl } from '@/components/dashboard/PipelineStatusControl'
import type { DashboardLead } from '@/types/lead'
import {
  formatSignalLabel,
  offerLabels,
  pipelineStatusLabels,
  priorityLabels,
  qualificationLabels,
  websiteTypeLabels,
} from '@/utils/lead-analytics'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(value: string | null) {
  if (!value) return 'Não informado'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Não informado' : dateFormatter.format(date)
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-item">
      <span>{label}</span>
      <strong>{value}/100</strong>
      <div className="score-item__track" aria-hidden="true">
        <span style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  )
}

function SignalList({
  emptyLabel,
  signals,
  tone,
}: {
  emptyLabel: string
  signals: string[]
  tone: 'positive' | 'opportunity' | 'risk'
}) {
  if (!signals.length) return <span className="detail-empty">{emptyLabel}</span>

  return (
    <div className="signal-list">
      {signals.map((signal) => (
        <span className={`signal-tag signal-tag--${tone}`} key={signal}>
          {formatSignalLabel(signal)}
        </span>
      ))}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>
}

export function LeadDetailsDialog({
  lead,
  onClose,
}: {
  lead: DashboardLead
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const location = [lead.street_address, lead.neighborhood, lead.city, lead.state, lead.zipcode]
    .filter(Boolean)
    .join(', ')

  useEffect(() => {
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section
        aria-labelledby="lead-details-title"
        aria-modal="true"
        className="lead-dialog"
        role="dialog"
      >
        <header className="lead-dialog__header">
          <div>
            <span className="eyebrow">Dossiê operacional</span>
            <h2 id="lead-details-title">{lead.business_name}</h2>
            <p>{lead.primary_category ?? 'Categoria não informada'} · {location || 'Local não informado'}</p>
          </div>
          <button
            aria-label="Fechar detalhes do lead"
            className="dialog-close"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <LuX />
          </button>
        </header>

        <div className="lead-dialog__summary">
          <div className="summary-priority">
            <span className={`priority-badge priority-badge--${lead.priority}`}>
              {priorityLabels[lead.priority]}
            </span>
            <div><strong>{lead.overall_score}</strong><span>score geral</span></div>
          </div>
          <span className={`status-pill status-pill--${lead.pipeline_status}`}>
            {pipelineStatusLabels[lead.pipeline_status]}
          </span>
          <span className="qualification-label">{qualificationLabels[lead.qualification_status]}</span>
        </div>

        <div className="lead-dialog__actions" aria-label="Ações rápidas do lead">
          <LeadQuickActions lead={lead} />
          <PipelineStatusControl leadId={lead.id} status={lead.pipeline_status} label="Status operacional" />
        </div>

        <div className="lead-dialog__body">
          <section className="detail-section detail-section--wide">
            <div className="detail-section__heading">
              <div><span>Próximo passo</span><h3>Condução da abordagem</h3></div>
              <span className="offer-pill">{offerLabels[lead.recommended_offer]}</span>
            </div>
            <div className="commercial-brief">
              <div><span>Próxima ação</span><strong>{lead.next_action ?? 'Não definida'}</strong></div>
              <div><span>Ângulo sugerido</span><strong>{lead.approach_angle ?? 'Não informado'}</strong></div>
              <div><span>Elegibilidade</span><strong>{lead.pipeline_eligible ? 'Apto para o pipeline' : 'Fora da fila ativa'}</strong></div>
            </div>
          </section>

          <section className="detail-section detail-section--wide">
            <div className="detail-section__heading"><div><span>Scoring</span><h3>Leitura comercial</h3></div><LuChartBar /></div>
            <div className="score-grid">
              <ScoreItem label="Geral" value={lead.overall_score} />
              <ScoreItem label="Google Maps" value={lead.google_maps_score} />
              <ScoreItem label="Website" value={lead.website_score} />
              <ScoreItem label="Tração" value={lead.traction_score} />
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section__heading"><div><span>Motivos</span><h3>Por que abordar</h3></div><LuSparkles /></div>
            <SignalList emptyLabel="Nenhum motivo registrado." signals={lead.qualification_reasons} tone="opportunity" />
          </section>
          <section className="detail-section">
            <div className="detail-section__heading"><div><span>Ganchos</span><h3>Pontos para a conversa</h3></div><LuBadgeCheck /></div>
            <SignalList emptyLabel="Nenhum gancho comercial registrado." signals={lead.sales_hooks} tone="positive" />
          </section>

          <section className="detail-section detail-section--wide">
            <div className="detail-section__heading"><div><span>Presença digital</span><h3>Website e perfil Google</h3></div><LuBuilding2 /></div>
            <dl className="detail-list">
              <DetailItem label="Tipo de presença" value={websiteTypeLabels[lead.website_type]} />
              <DetailItem label="Website próprio" value={lead.has_own_website ? 'Sim' : 'Não'} />
              <DetailItem label="Domínio" value={lead.website_domain ?? 'Não informado'} />
              <DetailItem label="Perfil Google" value={lead.google_claimed ? 'Reivindicado' : 'Não reivindicado'} />
              <DetailItem label="Avaliação" value={lead.rating?.toFixed(1) ?? 'Não informada'} />
              <DetailItem label="Avaliações" value={String(lead.review_count)} />
              <DetailItem label="Fotos" value={String(lead.photo_count)} />
              <DetailItem label="Completude do perfil" value={lead.profile_completeness === null ? 'Não calculada' : `${lead.profile_completeness}%`} />
            </dl>
          </section>

          <section className="detail-section detail-section--wide">
            <div className="detail-section__heading"><div><span>Dados da empresa</span><h3>Informações de referência</h3></div><LuClipboardList /></div>
            <dl className="detail-list">
              <DetailItem label="Categorias" value={lead.categories.join(', ') || 'Não informadas'} />
              <DetailItem label="Busca de origem" value={lead.search_keyword ?? 'Não informada'} />
              <DetailItem label="Telefone" value={lead.phone_e164 ?? lead.phone ?? 'Não informado'} />
              <DetailItem label="Endereço" value={location || 'Não informado'} />
              <DetailItem label="Negócio operacional" value={lead.operational ? 'Sim' : 'Não'} />
              <DetailItem label="Agendamento recomendado" value={lead.appointment_recommended ? 'Sim' : 'Não'} />
              <DetailItem label="Última atualização" value={formatDate(lead.updated_at)} />
              <DetailItem label="Qualificado em" value={formatDate(lead.qualified_at)} />
            </dl>
          </section>

          <section className="detail-section detail-section--wide">
            <div className="detail-section__heading"><div><span>Oportunidades detectadas</span><h3>Foco recomendado</h3></div><LuMapPin /></div>
            <div className="commercial-brief">
              <div><span>Google Maps</span><strong>{lead.google_maps_opportunity ? 'Oportunidade identificada' : 'Sem alerta'}</strong></div>
              <div><span>Website</span><strong>{lead.website_opportunity ? 'Oportunidade identificada' : 'Sem alerta'}</strong></div>
              <div><span>Oferta combinada</span><strong>{lead.dual_opportunity ? 'Sim' : 'Não'}</strong></div>
            </div>
          </section>
        </div>

        <footer className="lead-dialog__footer">
          <span>Chave do lead: {lead.lead_key}</span>
          <span>Origem: {lead.source}</span>
        </footer>
      </section>
    </div>
  )
}
