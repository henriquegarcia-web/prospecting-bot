import type { ChangeEvent } from 'react'
import { LuSearch, LuSlidersHorizontal } from 'react-icons/lu'

import { useDashboardContext } from '@/contexts/dashboard-context'
import type { LeadTier } from '@/types/lead'
import {
  opportunityOptions,
  tierOptions,
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
    <section className="filter-panel" aria-label="Filtros de curadoria">
      <div className="filter-panel__heading">
        <LuSlidersHorizontal />
        <div><strong>Curadoria da base</strong><span>Refine a visão sem alterar os dados</span></div>
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
          placeholder="Buscar empresa, categoria ou cidade..."
        />
      </label>
      <label className="select-field">
        <span>Tier</span>
        <select
          value={filters.tier}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              tier: event.target.value as LeadTier | 'all',
            }))
          }
        >
          {tierOptions.map((tier) => (
            <option key={tier} value={tier}>
              {tier === 'all' ? 'Todos os tiers' : `Tier ${tier}`}
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
