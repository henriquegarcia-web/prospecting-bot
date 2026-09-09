import { useId } from 'react'

import { useUpdateLeadPipelineStatus } from '@/hooks/use-leads-dashboard'
import {
  pipelineStatuses,
  type PipelineStatus,
} from '@/types/lead'
import { pipelineStatusLabels } from '@/utils/lead-analytics'

export function PipelineStatusControl({
  leadId,
  status,
  label,
}: {
  leadId: string
  status: PipelineStatus
  label?: string
}) {
  const selectId = useId()
  const feedbackId = `${selectId}-feedback`
  const updatePipelineStatus = useUpdateLeadPipelineStatus()
  const selectedStatus = updatePipelineStatus.isPending
    ? updatePipelineStatus.variables.pipelineStatus
    : status

  const handleStatusChange = (nextStatus: PipelineStatus) => {
    if (nextStatus === status) return

    updatePipelineStatus.reset()
    updatePipelineStatus.mutate({ leadId, pipelineStatus: nextStatus })
  }

  const feedback = updatePipelineStatus.isError
    ? 'Não foi possível atualizar o status. Tente novamente.'
    : updatePipelineStatus.isSuccess
      ? 'Status atualizado.'
      : null

  return (
    <div className="pipeline-control">
      <label
        className={label ? 'pipeline-control__label' : 'sr-only'}
        htmlFor={selectId}
      >
        {label ?? 'Status do pipeline'}
      </label>
      <select
        aria-describedby={feedback ? feedbackId : undefined}
        className="pipeline-control__select"
        disabled={updatePipelineStatus.isPending}
        id={selectId}
        onChange={(event) => handleStatusChange(event.target.value as PipelineStatus)}
        value={selectedStatus}
      >
        {pipelineStatuses.map((pipelineStatus) => (
          <option key={pipelineStatus} value={pipelineStatus}>
            {pipelineStatusLabels[pipelineStatus]}
          </option>
        ))}
      </select>
      {feedback ? (
        <span
          className={`pipeline-control__feedback pipeline-control__feedback--${
            updatePipelineStatus.isError ? 'error' : 'success'
          }`}
          id={feedbackId}
          role={updatePipelineStatus.isError ? 'alert' : 'status'}
        >
          {feedback}
        </span>
      ) : null}
    </div>
  )
}
