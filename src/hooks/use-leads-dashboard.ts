import { useQuery } from '@tanstack/react-query'

import { getLeadsDashboardData } from '@/services/leads.service'

export const leadQueryKeys = {
  all: ['leads'] as const,
  dashboard: () => [...leadQueryKeys.all, 'dashboard'] as const,
}

export function useLeadsDashboard() {
  return useQuery({
    queryKey: leadQueryKeys.dashboard(),
    queryFn: getLeadsDashboardData,
    staleTime: 60_000,
  })
}
