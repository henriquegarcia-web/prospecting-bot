begin;

alter table public.leads enable row level security;

drop policy if exists "dashboard_read_leads" on public.leads;
drop policy if exists "authenticated_read_operational_leads" on public.leads;

create policy "authenticated_read_operational_leads"
on public.leads
for select
to authenticated
using (auth.uid() is not null);

-- The dashboard's direct projection and security_invoker views use these columns.
-- No UPDATE policy or privilege is granted; pipeline changes go through the RPC below.
revoke all privileges on table public.leads from public, anon, authenticated;

grant select (
  id,
  lead_key,
  source,
  search_keyword,
  business_name,
  primary_category,
  categories,
  is_nail_business,
  google_maps_url,
  country,
  state,
  city,
  neighborhood,
  street_address,
  zipcode,
  phone,
  phone_e164,
  has_phone,
  website_url,
  website_raw_url,
  website_type,
  website_platform,
  website_domain,
  website_is_valid,
  website_is_own_domain,
  has_website_presence,
  has_own_website,
  has_social_presence,
  social_platform,
  google_claimed,
  rating,
  review_count,
  has_reviews,
  photo_count,
  has_photos,
  has_hours,
  has_description,
  operational,
  permanently_closed,
  temporarily_closed,
  profile_completeness,
  appointment_recommended,
  accepts_cards,
  accepts_mobile_payment,
  has_parking,
  has_wifi,
  google_maps_score,
  website_score,
  traction_score,
  overall_score,
  qualification_status,
  priority,
  recommended_offer,
  approach_angle,
  google_maps_opportunity,
  website_opportunity,
  dual_opportunity,
  qualification_reasons,
  sales_hooks,
  pipeline_status,
  pipeline_eligible,
  next_action,
  created_at,
  updated_at,
  qualified_at
) on table public.leads to authenticated;

revoke all privileges on table public.v_lead_queue from public, anon, authenticated;
revoke all privileges on table public.v_website_opportunities from public, anon, authenticated;
revoke all privileges on table public.v_google_maps_opportunities from public, anon, authenticated;
revoke all privileges on table public.v_lead_metrics from public, anon, authenticated;

grant select on table public.v_lead_queue to authenticated;
grant select on table public.v_website_opportunities to authenticated;
grant select on table public.v_google_maps_opportunities to authenticated;
grant select on table public.v_lead_metrics to authenticated;

create or replace function public.update_lead_pipeline_status(
  p_lead_id uuid,
  p_pipeline_status text
)
returns table (
  id uuid,
  pipeline_status text,
  qualified_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_pipeline_status text := lower(btrim(p_pipeline_status));
begin
  if auth.role() is distinct from 'authenticated' or auth.uid() is null then
    raise exception 'An authenticated session is required'
      using errcode = '42501';
  end if;

  if v_pipeline_status is null
    or v_pipeline_status not in ('new', 'qualified', 'disqualified', 'archived') then
    raise exception 'Invalid pipeline status: %', p_pipeline_status
      using errcode = '22023';
  end if;

  return query
  update public.leads as l
  set
    pipeline_status = v_pipeline_status,
    qualified_at = case
      when v_pipeline_status = 'qualified' and l.qualified_at is null then now()
      else l.qualified_at
    end
  where l.id = p_lead_id
  returning l.id, l.pipeline_status, l.qualified_at, l.updated_at;

  if not found then
    raise exception 'Lead not found'
      using errcode = 'P0002';
  end if;
end;
$$;

revoke all privileges on function public.update_lead_pipeline_status(uuid, text)
from public, anon, authenticated, service_role;

grant execute on function public.update_lead_pipeline_status(uuid, text)
to authenticated;

commit;
