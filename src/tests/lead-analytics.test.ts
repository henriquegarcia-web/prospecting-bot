import { createLeadFixture } from '@/tests/fixtures/lead'
import { filterLeads, getLeadAnalytics } from '@/utils/lead-analytics'

describe('lead analytics', () => {
  const leads = [
    createLeadFixture(),
    createLeadFixture({
      id: 'lead-2',
      business_name: 'Studio Aurora',
      city: 'Recife',
      state: 'PE',
      contactable: false,
      has_phone: false,
      has_website: true,
      lead_priority_score: 50,
      lead_tier: 'C',
      is_qualified: false,
      status: 'pending',
      recommended_offer: 'google_maps',
    }),
  ]

  it('calcula os principais indicadores do recorte', () => {
    const analytics = getLeadAnalytics(leads)

    expect(analytics.total).toBe(2)
    expect(analytics.contactableRate).toBe(50)
    expect(analytics.qualifiedRate).toBe(50)
    expect(analytics.averagePriority).toBe(72)
  })

  it('filtra por texto, tier e oportunidade', () => {
    expect(
      filterLeads(leads, {
        query: 'recife',
        tier: 'C',
        opportunity: 'all',
      }),
    ).toHaveLength(1)

    expect(
      filterLeads(leads, {
        query: '',
        tier: 'all',
        opportunity: 'no_website',
      }),
    ).toEqual([leads[0]])
  })
})
