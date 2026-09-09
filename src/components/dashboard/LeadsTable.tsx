import { useMemo, useState } from 'react'
import {
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuMapPin,
} from 'react-icons/lu'

import { LeadDetailsDialog } from '@/components/dashboard/LeadDetailsDialog'
import { LeadQuickActions } from '@/components/dashboard/LeadQuickActions'
import { PipelineStatusControl } from '@/components/dashboard/PipelineStatusControl'
import type { DashboardLead } from '@/types/lead'
import {
  offerLabels,
  pipelineStatusLabels,
  priorityLabels,
  qualificationLabels,
} from '@/utils/lead-analytics'

function locationLabel(lead: DashboardLead) {
  return [lead.city, lead.state].filter(Boolean).join(', ') || 'Local não informado'
}

export function LeadsTable({ leads }: { leads: DashboardLead[] }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
  const [selectedLead, setSelectedLead] = useState<DashboardLead | null>(null)
  const pageCount = Math.max(Math.ceil(leads.length / rowsPerPage), 1)
  const currentPage = Math.min(page, pageCount - 1)
  const first = currentPage * rowsPerPage
  const visibleLeads = useMemo(
    () => leads.slice(first, first + rowsPerPage),
    [first, leads, rowsPerPage],
  )

  return (
    <div className="leads-table">
      <div className="table-container">
        <table aria-label="Leads para operação">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Prioridade</th>
              <th>Oportunidade</th>
              <th>Contato rápido</th>
              <th>Status operacional</th>
              <th><span className="sr-only">Abrir dossiê</span></th>
            </tr>
          </thead>
          <tbody>
            {visibleLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className="lead-cell">
                    <strong>{lead.business_name}</strong>
                    <span>{lead.primary_category ?? 'Sem categoria'}</span>
                    <small><LuMapPin aria-hidden="true" /> {locationLabel(lead)}</small>
                  </div>
                </td>
                <td>
                  <div className="priority-cell">
                    <span className={`priority-badge priority-badge--${lead.priority}`}>
                      {priorityLabels[lead.priority]}
                    </span>
                    <div><strong>{lead.overall_score}</strong><span>/100</span></div>
                  </div>
                  <small className="confidence-label">Score geral</small>
                </td>
                <td>
                  <div className="offer-cell">
                    <span className="offer-pill">{offerLabels[lead.recommended_offer]}</span>
                    <small>{lead.approach_angle ?? qualificationLabels[lead.qualification_status]}</small>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <strong className={lead.has_phone ? 'is-positive' : 'is-muted'}>
                      {lead.has_phone ? 'Telefone disponível' : 'Sem telefone'}
                    </strong>
                    <LeadQuickActions lead={lead} />
                  </div>
                </td>
                <td>
                  <div className="status-cell">
                    <span className={`status-pill status-pill--${lead.pipeline_status}`}>
                      {pipelineStatusLabels[lead.pipeline_status]}
                    </span>
                    <PipelineStatusControl leadId={lead.id} status={lead.pipeline_status} />
                  </div>
                </td>
                <td>
                  <button
                    aria-label={`Abrir dossiê de ${lead.business_name}`}
                    className="table-link"
                    onClick={() => setSelectedLead(lead)}
                    type="button"
                  >
                    <LuEye aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-pagination">
        <div className="table-pagination__size">
          <label htmlFor="rows-per-page">Itens por página</label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value))
              setPage(0)
            }}
          >
            {[8, 16, 24].map((amount) => (
              <option key={amount} value={amount}>{amount}</option>
            ))}
          </select>
        </div>
        <span>
          {leads.length
            ? `${first + 1}–${Math.min(first + rowsPerPage, leads.length)} de ${leads.length}`
            : '0 resultados'}
        </span>
        <div className="table-pagination__actions">
          <button
            className="ui-button ui-button--text ui-button--icon"
            type="button"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Página anterior"
          >
            <LuChevronLeft aria-hidden="true" />
          </button>
          <span>Página {currentPage + 1} de {pageCount}</span>
          <button
            className="ui-button ui-button--text ui-button--icon"
            type="button"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Próxima página"
          >
            <LuChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      {selectedLead ? <LeadDetailsDialog lead={selectedLead} onClose={() => setSelectedLead(null)} /> : null}
    </div>
  )
}
