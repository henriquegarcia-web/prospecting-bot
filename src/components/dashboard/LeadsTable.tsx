import {
  LuChevronLeft,
  LuChevronRight,
  LuExternalLink,
  LuMapPin,
  LuStar,
} from 'react-icons/lu'
import { useMemo, useState } from 'react'

import type { DashboardLead, LeadTier } from '@/types/lead'
import { offerLabels, statusLabels } from '@/utils/lead-analytics'

const numberFormatter = new Intl.NumberFormat('pt-BR')

function locationLabel(lead: DashboardLead) {
  return [lead.city, lead.state].filter(Boolean).join(', ') || 'Local não informado'
}

function TierBadge({ tier }: { tier: LeadTier | null }) {
  return <span className={`tier-badge tier-badge--${tier ?? 'none'}`}>{tier ?? '—'}</span>
}

export function LeadsTable({ leads }: { leads: DashboardLead[] }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(8)
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
        <table aria-label="Leads priorizados para curadoria">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Prioridade</th>
              <th>Oferta indicada</th>
              <th>Presença digital</th>
              <th>Status</th>
              <th>
                <span className="sr-only">Abrir no Maps</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleLeads.map((lead) => {
              const offer = lead.recommended_offer

              return (
                <tr key={lead.id}>
                  <td>
                    <div className="lead-cell">
                      <strong>{lead.business_name}</strong>
                      <span>{lead.primary_category ?? 'Sem categoria'}</span>
                      <small>
                        <LuMapPin aria-hidden="true" /> {locationLabel(lead)}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="priority-cell">
                      <TierBadge tier={lead.lead_tier} />
                      <div>
                        <strong>{lead.lead_priority_score ?? '—'}</strong>
                        <span>/100</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="offer-pill">
                      {offer ? offerLabels[offer] : 'Não definida'}
                    </span>
                  </td>
                  <td>
                    <div className="digital-cell">
                      <span className={lead.has_website ? 'is-positive' : 'is-muted'}>
                        {lead.has_website ? 'Com site' : 'Sem site'}
                      </span>
                      <span>
                        <LuStar aria-hidden="true" />{' '}
                        {lead.rating?.toFixed(1) ?? '—'} ·{' '}
                        {numberFormatter.format(lead.review_count ?? 0)} avaliações
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill status-pill--${lead.status}`}>
                      {statusLabels[lead.status]}
                    </span>
                  </td>
                  <td>
                    {lead.google_maps_url ? (
                      <a
                        className="table-link"
                        href={lead.google_maps_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Abrir ${lead.business_name} no Google Maps`}
                      >
                        <LuExternalLink aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="table-link table-link--disabled">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
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
    </div>
  )
}
