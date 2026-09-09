import type { ChangeEvent } from 'react'
import { LuSearch, LuSlidersHorizontal } from 'react-icons/lu'

import { useDashboardContext } from '@/contexts/dashboard-context'
import type { LeadPriority, PipelineStatus } from '@/types/lead'
import {
  opportunityOptions,
  priorityLabels,
  priorityOptions,
  statusOptions,
  type OpportunityFilter,
} from '@/utils/lead-analytics'

export function DashboardFilters() {
  const {
    clearFilters,
    filters,
    hasActiveFilters,
    setFilters,
  } = useDashboardContext()

  return (
    <section className="filter-panel" aria-label="Filtros da operação">
      <div className="filter-panel__heading">
        <LuSlidersHorizontal />
        <div><strong>Refine a fila</strong><span>Encontre e priorize os próximos contatos</span></div>
      </div>
      <label className="search-field">
        <span className="sr-only">Buscar leads</span>
        <LuSearch />
        <input
          className="ui-input"
          value={filters.query}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFilters((current) => ({ ...current, query: event.target.value }))
          }
          placeholder="Buscar empresa, cidade, telefone ou oportunidade..."
        />
      </label>
      <label className="select-field">
        <span>Prioridade</span>
        <select
          value={filters.priority}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              priority: event.target.value as LeadPriority | 'all',
            }))
          }
        >
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority === 'all' ? 'Todas as prioridades' : priorityLabels[priority]}
            </option>
          ))}
        </select>
      </label>
      <label className="select-field select-field--wide">
        <span>Oportunidade</span>
        <select
          value={filters.opportunity}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              opportunity: event.target.value as OpportunityFilter,
            }))
          }
        >
          {opportunityOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label className="select-field">
        <span>Pipeline</span>
        <select
          value={filters.status}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              status: event.target.value as PipelineStatus | 'all',
            }))
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      {hasActiveFilters ? (
        <button
          className="ui-button ui-button--text ui-button--small"
          type="button"
          onClick={clearFilters}
        >
          Limpar filtros
        </button>
      ) : null}
    </section>
  )
}
