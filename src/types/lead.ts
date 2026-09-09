export const pipelineStatuses = [
  'new',
  'qualified',
  'disqualified',
  'archived',
] as const

export type PipelineStatus = (typeof pipelineStatuses)[number]

export const leadPriorities = ['low', 'medium', 'high', 'hot'] as const

export type LeadPriority = (typeof leadPriorities)[number]

export const qualificationStatuses = [
  'out_of_niche',
  'invalid',
  'limited_contact',
  'low_priority',
  'nurture',
  'qualified',
  'high_potential',
] as const

export type QualificationStatus = (typeof qualificationStatuses)[number]

export const recommendedOffers = [
  'website',
  'google_maps',
  'maps_and_website',
  'audit_first',
  'no_contact',
  'invalid',
] as const

export type RecommendedOffer = (typeof recommendedOffers)[number]

export const websiteTypes = [
  'none',
  'own_domain',
  'social',
  'messaging',
  'link_in_bio',
  'booking',
  'directory',
  'hosted_builder',
  'url_shortener',
  'invalid',
] as const

export type WebsiteType = (typeof websiteTypes)[number]

/**
 * Projection used by the authenticated prospecting dashboard. It mirrors the
 * post-migration `public.leads` contract and deliberately excludes the free
 * form `meta` and `enrichment` JSON fields.
 */
export interface DashboardLead {
  id: string
  lead_key: string
  source: string
  search_keyword: string | null
  business_name: string
  primary_category: string | null
  categories: string[]
  is_nail_business: boolean

  google_maps_url: string | null

  country: string | null
  state: string | null
  city: string | null
  neighborhood: string | null
  street_address: string | null
  zipcode: string | null

  phone: string | null
  phone_e164: string | null
  has_phone: boolean

  website_url: string | null
  website_raw_url: string | null
  website_domain: string | null
  website_type: WebsiteType
  website_platform: string | null
  website_is_valid: boolean
  website_is_own_domain: boolean
  has_website_presence: boolean
  has_own_website: boolean
  has_social_presence: boolean
  social_platform: string | null

  google_claimed: boolean
  rating: number | null
  review_count: number
  has_reviews: boolean
  photo_count: number
  has_photos: boolean
  has_hours: boolean
  has_description: boolean
  operational: boolean
  permanently_closed: boolean
  temporarily_closed: boolean
  profile_completeness: number | null

  appointment_recommended: boolean
  accepts_cards: boolean
  accepts_mobile_payment: boolean
  has_parking: boolean
  has_wifi: boolean

  google_maps_score: number
  website_score: number
  traction_score: number
  overall_score: number

  qualification_status: QualificationStatus
  priority: LeadPriority
  recommended_offer: RecommendedOffer
  approach_angle: string | null
  google_maps_opportunity: boolean
  website_opportunity: boolean
  dual_opportunity: boolean
  qualification_reasons: string[]
  sales_hooks: string[]

  pipeline_status: PipelineStatus
  pipeline_eligible: boolean
  next_action: string | null

  created_at: string
  updated_at: string
  qualified_at: string | null
}

export interface LeadQueueItem {
  id: string
  lead_key: string
  business_name: string
  phone_e164: string | null
  city: string | null
  neighborhood: string | null
  website_type: WebsiteType
  website_platform: string | null
  has_own_website: boolean
  rating: number | null
  review_count: number
  photo_count: number
  google_maps_score: number
  website_score: number
  traction_score: number
  overall_score: number
  qualification_status: QualificationStatus
  priority: LeadPriority
  recommended_offer: RecommendedOffer
  approach_angle: string | null
  google_maps_opportunity: boolean
  website_opportunity: boolean
  dual_opportunity: boolean
  qualification_reasons: string[]
  sales_hooks: string[]
  pipeline_status: PipelineStatus
  next_action: string | null
  created_at: string
  updated_at: string
}

export interface LeadMetrics {
  total_leads: number
  nail_leads: number
  contactable_leads: number
  own_website_leads: number
  social_only_leads: number
  link_in_bio_leads: number
  booking_platform_leads: number
  hosted_website_leads: number
  no_website_leads: number
  google_maps_opportunities: number
  website_opportunities: number
  dual_opportunities: number
  hot_leads: number
  high_leads: number
  high_potential_leads: number
  eligible_leads: number
  new_leads: number
  qualified_leads: number
}

export interface PipelineStatusUpdate {
  id: string
  pipeline_status: PipelineStatus
  qualified_at: string | null
  updated_at: string
}

export type Lead = DashboardLead
