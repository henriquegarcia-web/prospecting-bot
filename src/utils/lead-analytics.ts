import type {
  DashboardLead,
  LeadStatus,
  LeadTier,
  RecommendedOffer,
} from '@/types/lead'

export type OpportunityFilter =
  | 'all'
  | 'qualified'
  | 'contactable'
  | 'no_website'
  | 'maps_gap'

export interface LeadFilters {
  query: string
  tier: LeadTier | 'all'
  opportunity: OpportunityFilter
}

export interface DistributionItem {
  key: string
  label: string
  value: number
  color: string
}

export const tierOptions: Array<LeadTier | 'all'> = [
  'all',
  'A+',
  'A',
  'B+',
  'B',
  'C',
  'D',
]

export const opportunityOptions: Array<{
  value: OpportunityFilter
  label: string
}> = [
  { value: 'all', label: 'Todas as oportunidades' },
  { value: 'qualified', label: 'Somente qualificados' },
  { value: 'contactable', label: 'Com contato disponível' },
  { value: 'no_website', label: 'Sem website' },
  { value: 'maps_gap', label: 'Gap alto no Google Maps' },
]

export const statusLabels: Record<LeadStatus, string> = {
  pending: 'Pendente',
  queued: 'Na fila',
  contacted: 'Contatado',
  replied: 'Respondeu',
  qualified: 'Qualificado',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  won: 'Ganho',
  lost: 'Perdido',
  no_response: 'Sem resposta',
  invalid: 'Inválido',
  do_not_disturb: 'Não contatar',
}

export const offerLabels: Record<RecommendedOffer, string> = {
  google_maps: 'Google Maps',
  website: 'Website',
  google_maps_and_website: 'Maps + Website',
  nurture: 'Nutrição',
  none: 'Sem oferta',
}

const pipelineGroups: Array<{
  key: string
  label: string
  statuses: LeadStatus[]
  color: string
}> = [
  {
    key: 'new',
    label: 'Novos',
    statuses: ['pending', 'queued'],
    color: '#8b5cf6',
  },
  {
    key: 'approach',
    label: 'Em abordagem',
    statuses: ['contacted', 'no_response'],
    color: '#3b82f6',
  },
  {
    key: 'conversation',
    label: 'Em conversa',
    statuses: ['replied', 'qualified'],
    color: '#06b6d4',
  },
  {
    key: 'negotiation',
    label: 'Negociação',
    statuses: ['proposal', 'negotiation'],
    color: '#f59e0b',
  },
  {
    key: 'won',
    label: 'Ganhos',
    statuses: ['won'],
    color: '#10b981',
  },
  {
    key: 'discarded',
    label: 'Descartados',
    statuses: ['lost', 'invalid', 'do_not_disturb'],
    color: '#94a3b8',
  },
]

const normalize = (value: string | null | undefined) =>
  value?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() ?? ''

export function filterLeads(
  leads: DashboardLead[],
  filters: LeadFilters,
): DashboardLead[] {
  const query = normalize(filters.query.trim())

  return leads.filter((lead) => {
    const matchesQuery =
      !query ||
      [
        lead.business_name,
        lead.primary_category,
        lead.city,
        lead.state,
        lead.neighborhood,
        lead.search_keyword,
      ].some((value) => normalize(value).includes(query))

    const matchesTier =
      filters.tier === 'all' || lead.lead_tier === filters.tier

    const matchesOpportunity = (() => {
      switch (filters.opportunity) {
        case 'qualified':
          return lead.is_qualified
        case 'contactable':
          return lead.contactable
        case 'no_website':
          return !lead.has_website
        case 'maps_gap':
          return (lead.google_maps_gap_score ?? 0) >= 70
        default:
          return true
      }
    })()

    return matchesQuery && matchesTier && matchesOpportunity
  })
}

function percentage(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0
}

export function getLeadAnalytics(leads: DashboardLead[]) {
  const total = leads.length
  const contactable = leads.filter((lead) => lead.contactable).length
  const qualified = leads.filter((lead) => lead.is_qualified).length
  const scores = leads
    .map((lead) => lead.lead_priority_score)
    .filter((score): score is number => score !== null)
  const averagePriority = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0

  const pipeline: DistributionItem[] = pipelineGroups.map((group) => ({
    key: group.key,
    label: group.label,
    value: leads.filter((lead) => group.statuses.includes(lead.status)).length,
    color: group.color,
  }))

  const offers: DistributionItem[] = [
    ['google_maps', 'Google Maps', '#7c3aed'],
    ['website', 'Website', '#2563eb'],
    ['google_maps_and_website', 'Maps + Website', '#0d9488'],
    ['nurture', 'Nutrição', '#d97706'],
    ['none', 'Sem oferta', '#94a3b8'],
  ].map(([key, label, color]) => ({
    key,
    label,
    color,
    value: leads.filter((lead) => lead.recommended_offer === key).length,
  }))

  const completeness: DistributionItem[] = [
    ['phone', 'Telefone', leads.filter((lead) => lead.has_phone).length],
    ['website', 'Website', leads.filter((lead) => lead.has_website).length],
    ['rating', 'Avaliações', leads.filter((lead) => lead.has_rating).length],
    ['photos', 'Fotos', leads.filter((lead) => lead.has_photos).length],
    [
      'description',
      'Descrição',
      leads.filter((lead) => lead.has_description).length,
    ],
    [
      'hours',
      'Horários',
      leads.filter((lead) => lead.has_business_hours).length,
    ],
  ].map(([key, label, value]) => ({
    key: String(key),
    label: String(label),
    value: percentage(Number(value), total),
    color: '#14b8a6',
  }))

  const topOpportunities = [...leads]
    .filter((lead) => lead.lead_priority_score !== null)
    .sort(
      (first, second) =>
        (second.lead_priority_score ?? 0) - (first.lead_priority_score ?? 0),
    )
    .slice(0, 4)

  return {
    total,
    contactable,
    contactableRate: percentage(contactable, total),
    qualified,
    qualifiedRate: percentage(qualified, total),
    noWebsiteRate: percentage(
      leads.filter((lead) => !lead.has_website).length,
      total,
    ),
    averagePriority,
    pipeline,
    offers,
    completeness,
    topOpportunities,
  }
}
