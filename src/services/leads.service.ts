import { getSupabaseClient } from '@/lib/supabase'
import type { DashboardLead } from '@/types/lead'

export const DASHBOARD_SAMPLE_LIMIT = 1000

const dashboardLeadColumns = [
  'id',
  'updated_at',
  'search_keyword',
  'business_name',
  'primary_category',
  'google_maps_url',
  'state',
  'city',
  'neighborhood',
  'has_phone',
  'has_website',
  'rating',
  'has_rating',
  'review_count',
  'has_photos',
  'has_description',
  'has_business_hours',
  'contactable',
  'google_maps_gap_score',
  'lead_priority_score',
  'lead_tier',
  'recommended_offer',
  'is_qualified',
  'status',
].join(',')

export interface LeadsDashboardData {
  leads: DashboardLead[]
  total: number
  sampled: boolean
}

export async function getLeadsDashboardData(): Promise<LeadsDashboardData> {
  const { data, error, count } = await getSupabaseClient()
    .from('leads')
    .select(dashboardLeadColumns, { count: 'exact' })
    .order('lead_priority_score', { ascending: false, nullsFirst: false })
    .limit(DASHBOARD_SAMPLE_LIMIT)

  if (error) {
    throw new Error('Não foi possível carregar os leads da operação.')
  }

  const leads = (data ?? []) as unknown as DashboardLead[]
  const total = count ?? leads.length

  return {
    leads,
    total,
    sampled: total > leads.length,
  }
}
