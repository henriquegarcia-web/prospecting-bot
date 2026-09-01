import type { Dispatch, SetStateAction } from 'react'
import { useOutletContext } from 'react-router-dom'

import type { useLeadsDashboard } from '@/hooks/use-leads-dashboard'
import type { DashboardLead } from '@/types/lead'
import type {
  getLeadAnalytics,
  LeadFilters,
} from '@/utils/lead-analytics'

export const initialDashboardFilters: LeadFilters = {
  query: '',
  tier: 'all',
  opportunity: 'all',
}

export interface DashboardOutletContext {
  analytics: ReturnType<typeof getLeadAnalytics>
  clearFilters: () => void
  dashboardQuery: ReturnType<typeof useLeadsDashboard>
  filteredLeads: DashboardLead[]
  filters: LeadFilters
  hasActiveFilters: boolean
  setFilters: Dispatch<SetStateAction<LeadFilters>>
}

export function useDashboardContext() {
  return useOutletContext<DashboardOutletContext>()
}
