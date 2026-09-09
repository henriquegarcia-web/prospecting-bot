import { useMutation, useQuery } from '@tanstack/react-query'

import { queryClient } from '@/lib/query-client'
import {
  getLeadsDashboardData,
  type LeadsDashboardData,
  updateLeadPipelineStatus,
} from '@/services/leads.service'
import type { PipelineStatus } from '@/types/lead'

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

interface UpdatePipelineStatusInput {
  leadId: string
  pipelineStatus: PipelineStatus
}

export function useUpdateLeadPipelineStatus() {
  return useMutation({
    mutationFn: ({ leadId, pipelineStatus }: UpdatePipelineStatusInput) =>
      updateLeadPipelineStatus(leadId, pipelineStatus),
    onSuccess: (updatedLead) => {
      queryClient.setQueryData<LeadsDashboardData>(leadQueryKeys.dashboard(), (current) => {
        if (!current) return current

        return {
          ...current,
          leads: current.leads.map((lead) => (
            lead.id === updatedLead.id
              ? {
                ...lead,
                pipeline_status: updatedLead.pipeline_status,
                qualified_at: updatedLead.qualified_at,
                updated_at: updatedLead.updated_at,
              }
              : lead
          )),
          queue: current.queue.filter((lead) => (
            lead.id !== updatedLead.id || updatedLead.pipeline_status === 'new'
          )),
        }
      })

      void queryClient.invalidateQueries({ queryKey: leadQueryKeys.dashboard() })
    },
  })
}
