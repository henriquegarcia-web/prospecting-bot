begin;

alter table public.leads enable row level security;

drop policy if exists "dashboard_read_leads" on public.leads;

create policy "dashboard_read_leads"
on public.leads
for select
to authenticated
using (true);

revoke select on table public.leads from anon, authenticated;

grant select (
  id,
  created_at,
  updated_at,
  first_seen_at,
  last_seen_at,
  search_keyword,
  matched_keywords,
  discovery_count,
  business_name,
  primary_category,
  industry,
  subindustry,
  business_type,
  google_maps_url,
  state,
  city,
  neighborhood,
  street_address,
  phone,
  phone_e164,
  has_phone,
  is_phone_contactable,
  is_whatsapp_candidate,
  website,
  website_domain,
  has_website,
  website_original,
  digital_presence_url,
  digital_presence_type,
  digital_maturity_score,
  business_status,
  is_active_business,
  is_suspected_ghost_business,
  is_claimed,
  rating,
  has_rating,
  review_count,
  has_reviews,
  photos_count,
  has_photos,
  has_description,
  has_business_hours,
  contactable,
  data_completeness_score,
  qualification_confidence,
  icp_score,
  sales_readiness_score,
  sales_fit_score,
  contactability_score,
  google_maps_gap_score,
  google_maps_confidence_score,
  google_maps_priority_score,
  google_maps_tier,
  google_maps_reasons,
  website_gap_score,
  website_confidence_score,
  website_priority_score,
  website_tier,
  website_reasons,
  opportunity_score,
  lead_priority_score,
  lead_tier,
  is_eligible,
  eligibility_status,
  eligibility_reasons,
  recommended_offer,
  primary_pain,
  secondary_pain,
  best_sales_angle,
  positive_signals,
  opportunity_reasons,
  risk_signals,
  is_qualified,
  qualification_status,
  qualified_at,
  status
) on table public.leads to authenticated;

commit;
