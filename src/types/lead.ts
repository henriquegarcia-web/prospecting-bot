export type LeadSource = 'google_maps'

export type LeadStatus =
  | 'pending'
  | 'queued'
  | 'contacted'
  | 'replied'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'no_response'
  | 'invalid'
  | 'do_not_disturb'

export type LeadTier = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D'

export type RecommendedOffer =
  | 'google_maps'
  | 'website'
  | 'google_maps_and_website'
  | 'nurture'
  | 'none'

export type QualificationStatus =
  | 'qualified_high'
  | 'qualified'
  | 'nurture'
  | 'low_priority'

export interface Lead {
  id: string
  created_at: string
  updated_at: string
  source: LeadSource
  search_keyword: string
  business_name: string
  primary_category: string | null
  categories: string[]
  categories_count: number
  google_place_id: string
  google_cid: string | null
  google_maps_url: string | null
  country: string | null
  state: string | null
  city: string | null
  neighborhood: string | null
  street_address: string | null
  zipcode: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  phone_e164: string | null
  has_phone: boolean
  website: string | null
  website_domain: string | null
  has_website: boolean
  is_claimed: boolean
  rating: number | null
  has_rating: boolean
  review_count: number | null
  has_reviews: boolean
  photos_count: number | null
  has_photos: boolean
  low_photo_count: boolean
  has_description: boolean
  has_about: boolean
  has_business_attributes: boolean
  has_business_hours: boolean
  open_days_count: number
  open_7_days: boolean
  opens_saturday: boolean
  opens_sunday: boolean
  has_weekend_hours: boolean
  permanently_closed: boolean
  temporarily_closed: boolean
  is_active_business: boolean
  has_popular_times: boolean
  has_review_summary: boolean
  has_review_tags: boolean
  has_related_businesses: boolean
  contactable: boolean
  sales_readiness_score: number | null
  google_maps_gap_score: number | null
  google_maps_priority_score: number | null
  google_maps_tier: LeadTier | null
  google_maps_reasons: string[]
  website_gap_score: number | null
  website_priority_score: number | null
  website_tier: LeadTier | null
  website_reasons: string[]
  lead_priority_score: number | null
  lead_tier: LeadTier | null
  recommended_offer: RecommendedOffer | null
  is_qualified: boolean
  qualification_status: QualificationStatus | null
  score_version: number
  qualified_at: string | null
  status: LeadStatus
}

export type DashboardLead = Pick<
  Lead,
  | 'id'
  | 'updated_at'
  | 'search_keyword'
  | 'business_name'
  | 'primary_category'
  | 'google_maps_url'
  | 'state'
  | 'city'
  | 'neighborhood'
  | 'has_phone'
  | 'has_website'
  | 'rating'
  | 'has_rating'
  | 'review_count'
  | 'has_photos'
  | 'has_description'
  | 'has_business_hours'
  | 'contactable'
  | 'google_maps_gap_score'
  | 'lead_priority_score'
  | 'lead_tier'
  | 'recommended_offer'
  | 'is_qualified'
  | 'status'
>
