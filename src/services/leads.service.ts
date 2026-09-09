import { getSupabaseClient } from '@/lib/supabase'
import type {
  DashboardLead,
  LeadMetrics,
  LeadQueueItem,
  PipelineStatus,
  PipelineStatusUpdate,
} from '@/types/lead'

export const DASHBOARD_SAMPLE_LIMIT = 1000
export const OPERATION_QUEUE_LIMIT = 24

const dashboardLeadColumns = [
  'id',
  'lead_key',
  'source',
  'search_keyword',
  'business_name',
  'primary_category',
  'categories',
  'is_nail_business',
  'google_maps_url',
  'country',
  'state',
  'city',
  'neighborhood',
  'street_address',
  'zipcode',
  'phone',
  'phone_e164',
  'has_phone',
  'website_url',
  'website_raw_url',
  'website_domain',
  'website_type',
  'website_platform',
  'website_is_valid',
  'website_is_own_domain',
  'has_website_presence',
  'has_own_website',
  'has_social_presence',
  'social_platform',
  'google_claimed',
  'rating',
  'review_count',
  'has_reviews',
  'photo_count',
  'has_photos',
  'has_hours',
  'has_description',
  'operational',
  'permanently_closed',
  'temporarily_closed',
  'profile_completeness',
  'appointment_recommended',
  'accepts_cards',
  'accepts_mobile_payment',
  'has_parking',
  'has_wifi',
  'google_maps_score',
  'website_score',
  'traction_score',
  'overall_score',
  'qualification_status',
  'priority',
  'recommended_offer',
  'approach_angle',
  'google_maps_opportunity',
  'website_opportunity',
  'dual_opportunity',
  'qualification_reasons',
  'sales_hooks',
  'pipeline_status',
  'pipeline_eligible',
  'next_action',
  'created_at',
  'updated_at',
  'qualified_at',
].join(',')

const queueColumns = [
  'id',
  'lead_key',
  'business_name',
  'phone_e164',
  'city',
  'neighborhood',
  'website_type',
  'website_platform',
  'has_own_website',
  'rating',
  'review_count',
  'photo_count',
  'google_maps_score',
  'website_score',
  'traction_score',
  'overall_score',
  'qualification_status',
  'priority',
  'recommended_offer',
  'approach_angle',
  'google_maps_opportunity',
  'website_opportunity',
  'dual_opportunity',
  'qualification_reasons',
  'sales_hooks',
  'pipeline_status',
  'next_action',
  'created_at',
  'updated_at',
].join(',')

const metricColumns = [
  'total_leads',
  'nail_leads',
  'contactable_leads',
  'own_website_leads',
  'social_only_leads',
  'link_in_bio_leads',
  'booking_platform_leads',
  'hosted_website_leads',
  'no_website_leads',
  'google_maps_opportunities',
  'website_opportunities',
  'dual_opportunities',
  'hot_leads',
  'high_leads',
  'high_potential_leads',
  'eligible_leads',
  'new_leads',
  'qualified_leads',
].join(',')

export interface LeadsDashboardData {
  leads: DashboardLead[]
  metrics: LeadMetrics
  queue: LeadQueueItem[]
  total: number
  sampled: boolean
}

function toMetricValue(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function parseMetrics(record: Record<string, unknown> | null): LeadMetrics {
  return metricColumns.split(',').reduce<LeadMetrics>((metrics, key) => {
    metrics[key as keyof LeadMetrics] = toMetricValue(record?.[key])
    return metrics
  }, {} as LeadMetrics)
}

export async function getLeadsDashboardData(): Promise<LeadsDashboardData> {
  const supabase = getSupabaseClient()
  const [leadsResponse, metricsResponse, queueResponse] = await Promise.all([
    supabase
      .from('leads')
      .select(dashboardLeadColumns, { count: 'exact' })
      .order('overall_score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(DASHBOARD_SAMPLE_LIMIT),
    supabase
      .from('v_lead_metrics')
      .select(metricColumns)
      .maybeSingle(),
    supabase
      .from('v_lead_queue')
      .select(queueColumns)
      .limit(OPERATION_QUEUE_LIMIT),
  ])

  if (leadsResponse.error || metricsResponse.error || queueResponse.error) {
    throw new Error('Não foi possível carregar os dados da operação.')
  }

  const leads = (leadsResponse.data ?? []) as unknown as DashboardLead[]
  const total = leadsResponse.count ?? leads.length

  return {
    leads,
    metrics: parseMetrics(metricsResponse.data as Record<string, unknown> | null),
    queue: (queueResponse.data ?? []) as unknown as LeadQueueItem[],
    total,
    sampled: total > leads.length,
  }
}

export async function updateLeadPipelineStatus(
  leadId: string,
  pipelineStatus: PipelineStatus,
): Promise<PipelineStatusUpdate> {
  const { data, error } = await getSupabaseClient()
    .rpc('update_lead_pipeline_status', {
      p_lead_id: leadId,
      p_pipeline_status: pipelineStatus,
    })
    .maybeSingle()

  if (error || !data) {
    throw new Error('Não foi possível atualizar o status do lead.')
  }

  return data as PipelineStatusUpdate
}
