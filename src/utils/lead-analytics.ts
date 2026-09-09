import type {
  DashboardLead,
  LeadPriority,
  PipelineStatus,
  QualificationStatus,
  RecommendedOffer,
  WebsiteType,
} from '@/types/lead'

export type OpportunityFilter =
  | 'all'
  | 'ready_to_contact'
  | 'google_maps'
  | 'website'
  | 'dual'
  | 'no_website'
  | 'high_priority'

export interface LeadFilters {
  query: string
  priority: LeadPriority | 'all'
  opportunity: OpportunityFilter
  status: PipelineStatus | 'all'
}

export interface DistributionItem {
  key: string
  label: string
  value: number
  color: string
}

export interface OpportunityChannelSummary {
  key: 'google_maps' | 'website' | 'dual'
  label: string
  score: number
  leads: number
  color: string
}

export const priorityLabels: Record<LeadPriority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  hot: 'Quente',
}

export const pipelineStatusLabels: Record<PipelineStatus, string> = {
  new: 'Novo',
  qualified: 'Qualificado',
  disqualified: 'Desqualificado',
  archived: 'Arquivado',
}

export const qualificationLabels: Record<QualificationStatus, string> = {
  out_of_niche: 'Fora do nicho',
  invalid: 'Inválido',
  limited_contact: 'Contato limitado',
  low_priority: 'Baixa prioridade',
  nurture: 'Nutrição',
  qualified: 'Qualificado',
  high_potential: 'Alto potencial',
}

export const offerLabels: Record<RecommendedOffer, string> = {
  website: 'Website',
  google_maps: 'Google Maps',
  maps_and_website: 'Maps + Website',
  audit_first: 'Auditoria primeiro',
  no_contact: 'Não contatar',
  invalid: 'Inválido',
}

export const websiteTypeLabels: Record<WebsiteType, string> = {
  none: 'Sem presença digital',
  own_domain: 'Domínio próprio',
  social: 'Rede social',
  messaging: 'Mensageria',
  link_in_bio: 'Link na bio',
  booking: 'Plataforma de agendamento',
  directory: 'Diretório',
  hosted_builder: 'Construtor hospedado',
  url_shortener: 'Link encurtado',
  invalid: 'URL inválida',
}

export const priorityOptions: Array<LeadPriority | 'all'> = [
  'all',
  'hot',
  'high',
  'medium',
  'low',
]

export const statusOptions: Array<{ value: PipelineStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todo o pipeline' },
  ...Object.entries(pipelineStatusLabels).map(([value, label]) => ({
    value: value as PipelineStatus,
    label,
  })),
]

export const opportunityOptions: Array<{
  value: OpportunityFilter
  label: string
}> = [
  { value: 'all', label: 'Todas as oportunidades' },
  { value: 'ready_to_contact', label: 'Prontos para contato' },
  { value: 'high_priority', label: 'Alta prioridade' },
  { value: 'google_maps', label: 'Oportunidade Google Maps' },
  { value: 'website', label: 'Oportunidade Website' },
  { value: 'dual', label: 'Oportunidade combinada' },
  { value: 'no_website', label: 'Sem site próprio' },
]

const signalLabels: Record<string, string> = {
  active_business: 'Negócio ativo',
  high_rating: 'Avaliação alta',
  strong_review_volume: 'Bom volume de avaliações',
  permanently_closed: 'Fechado permanentemente',
  temporarily_closed: 'Fechado temporariamente',
  no_phone: 'Sem telefone',
  profile_not_claimed: 'Perfil não reivindicado',
  no_reviews: 'Sem avaliações',
  low_rating: 'Avaliação baixa',
  very_low_photo_count: 'Poucas fotos',
  no_description: 'Sem descrição',
  no_own_website: 'Sem site próprio',
  social_only_presence: 'Presença apenas social',
  link_in_bio_only: 'Apenas link na bio',
  booking_platform_dependent: 'Dependência de plataforma de agendamento',
  professional_digital_presence: 'Presença digital profissional',
  local_visibility: 'Visibilidade local',
}

const priorityWeight: Record<LeadPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  hot: 4,
}

const normalize = (value: string | null | undefined) =>
  value?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() ?? ''

export function formatSignalLabel(value: string) {
  return signalLabels[value] ?? value.replaceAll('_', ' ')
}

export function isContactable(lead: Pick<DashboardLead, 'has_phone' | 'phone' | 'phone_e164'>) {
  return lead.has_phone && Boolean(lead.phone_e164 ?? lead.phone)
}

function matchesOpportunity(lead: DashboardLead, opportunity: OpportunityFilter) {
  switch (opportunity) {
    case 'ready_to_contact':
      return lead.pipeline_eligible && lead.pipeline_status === 'new' && isContactable(lead)
    case 'high_priority':
      return lead.priority === 'hot' || lead.priority === 'high'
    case 'google_maps':
      return lead.google_maps_opportunity
    case 'website':
      return lead.website_opportunity
    case 'dual':
      return lead.dual_opportunity
    case 'no_website':
      return !lead.has_own_website
    default:
      return true
  }
}

export function filterLeads(leads: DashboardLead[], filters: LeadFilters): DashboardLead[] {
  const query = normalize(filters.query.trim())

  return leads.filter((lead) => {
    const searchableValues = [
      lead.business_name,
      lead.primary_category,
      lead.city,
      lead.state,
      lead.neighborhood,
      lead.phone,
      lead.phone_e164,
      lead.website_domain,
      lead.search_keyword,
      lead.approach_angle,
      ...lead.categories,
      ...lead.qualification_reasons,
      ...lead.sales_hooks,
    ]
    const matchesQuery = !query || searchableValues.some((value) => normalize(value).includes(query))
    const matchesPriority = filters.priority === 'all' || lead.priority === filters.priority
    const matchesStatus = filters.status === 'all' || lead.pipeline_status === filters.status

    return matchesQuery && matchesPriority && matchesStatus
      && matchesOpportunity(lead, filters.opportunity)
  })
}

function percentage(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0
}

function average(values: Array<number | null>) {
  const available = values.filter((value): value is number => value !== null)
  return available.length
    ? Math.round(available.reduce((sum, value) => sum + value, 0) / available.length)
    : 0
}

function getSignalDistribution(
  leads: DashboardLead[],
  getSignals: (lead: DashboardLead) => string[],
  color: string,
) {
  const counts = new Map<string, number>()

  leads.forEach((lead) => {
    new Set(getSignals(lead)).forEach((signal) => {
      counts.set(signal, (counts.get(signal) ?? 0) + 1)
    })
  })

  return [...counts.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 5)
    .map(([key, value]) => ({ key, label: formatSignalLabel(key), value, color }))
}

export function getLeadAnalytics(leads: DashboardLead[]) {
  const total = leads.length
  const eligible = leads.filter((lead) => lead.pipeline_eligible).length
  const contactable = leads.filter(isContactable).length
  const readyToContact = leads.filter((lead) =>
    lead.pipeline_eligible && lead.pipeline_status === 'new' && isContactable(lead),
  ).length
  const qualified = leads.filter((lead) => lead.pipeline_status === 'qualified').length
  const highPriority = leads.filter((lead) => lead.priority === 'hot' || lead.priority === 'high').length

  const pipeline: DistributionItem[] = (Object.entries(pipelineStatusLabels) as Array<[
    PipelineStatus,
    string,
  ]>).map(([status, label]) => ({
    key: status,
    label,
    value: leads.filter((lead) => lead.pipeline_status === status).length,
    color: {
      new: '#7c3aed',
      qualified: '#0f9f6e',
      disqualified: '#d97706',
      archived: '#94a3b8',
    }[status],
  }))

  const offers: DistributionItem[] = (Object.entries(offerLabels) as Array<[
    RecommendedOffer,
    string,
  ]>).map(([offer, label]) => ({
    key: offer,
    label,
    value: leads.filter((lead) => lead.recommended_offer === offer).length,
    color: {
      website: '#2563eb',
      google_maps: '#7c3aed',
      maps_and_website: '#0d9488',
      audit_first: '#d97706',
      no_contact: '#94a3b8',
      invalid: '#dc2626',
    }[offer],
  }))

  const completeness: DistributionItem[] = [
    ['phone', 'Telefone disponível', leads.filter(isContactable).length],
    ['website', 'Site próprio', leads.filter((lead) => lead.has_own_website).length],
    ['maps', 'Link do Google Maps', leads.filter((lead) => Boolean(lead.google_maps_url)).length],
    ['rating', 'Avaliações Google', leads.filter((lead) => lead.has_reviews).length],
    ['hours', 'Horários cadastrados', leads.filter((lead) => lead.has_hours).length],
    ['description', 'Descrição cadastrada', leads.filter((lead) => lead.has_description).length],
  ].map(([key, label, value]) => ({
    key: String(key),
    label: String(label),
    value: percentage(Number(value), total),
    color: '#14b8a6',
  }))

  const channelOpportunities: OpportunityChannelSummary[] = [
    {
      key: 'google_maps',
      label: 'Google Maps',
      score: average(leads.filter((lead) => lead.google_maps_opportunity).map((lead) => lead.google_maps_score)),
      leads: leads.filter((lead) => lead.google_maps_opportunity).length,
      color: '#7c3aed',
    },
    {
      key: 'website',
      label: 'Website',
      score: average(leads.filter((lead) => lead.website_opportunity).map((lead) => lead.website_score)),
      leads: leads.filter((lead) => lead.website_opportunity).length,
      color: '#2563eb',
    },
    {
      key: 'dual',
      label: 'Maps + Website',
      score: average(leads.filter((lead) => lead.dual_opportunity).map((lead) => lead.overall_score)),
      leads: leads.filter((lead) => lead.dual_opportunity).length,
      color: '#0d9488',
    },
  ]

  const topOpportunities = [...leads]
    .filter((lead) => lead.pipeline_eligible && lead.pipeline_status === 'new')
    .sort((first, second) =>
      priorityWeight[second.priority] - priorityWeight[first.priority]
      || second.overall_score - first.overall_score
      || new Date(first.created_at).getTime() - new Date(second.created_at).getTime(),
    )
    .slice(0, 5)

  return {
    total,
    eligible,
    eligibleRate: percentage(eligible, total),
    contactable,
    contactableRate: percentage(contactable, total),
    readyToContact,
    readyToContactRate: percentage(readyToContact, total),
    qualified,
    qualifiedRate: percentage(qualified, total),
    highPriority,
    highPriorityRate: percentage(highPriority, total),
    noOwnWebsiteRate: percentage(leads.filter((lead) => !lead.has_own_website).length, total),
    averageOverallScore: average(leads.map((lead) => lead.overall_score)),
    averageGoogleMapsScore: average(leads.map((lead) => lead.google_maps_score)),
    averageWebsiteScore: average(leads.map((lead) => lead.website_score)),
    averageCompleteness: average(leads.map((lead) => lead.profile_completeness)),
    pipeline,
    offers,
    completeness,
    channelOpportunities,
    topReasons: getSignalDistribution(leads, (lead) => lead.qualification_reasons, '#d97706'),
    topSalesHooks: getSignalDistribution(leads, (lead) => lead.sales_hooks, '#7c3aed'),
    topOpportunities,
  }
}
