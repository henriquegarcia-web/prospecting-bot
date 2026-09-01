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
  updated_at,
  search_keyword,
  business_name,
  primary_category,
  google_maps_url,
  state,
  city,
  neighborhood,
  has_phone,
  has_website,
  rating,
  has_rating,
  review_count,
  has_photos,
  has_description,
  has_business_hours,
  contactable,
  google_maps_gap_score,
  lead_priority_score,
  lead_tier,
  recommended_offer,
  is_qualified,
  status
) on table public.leads to authenticated;

commit;
