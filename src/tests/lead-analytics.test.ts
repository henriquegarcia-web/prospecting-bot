import { createLeadFixture } from '@/tests/fixtures/lead'
import { filterLeads, getLeadAnalytics } from '@/utils/lead-analytics'

describe('lead analytics', () => {
  const leads = [
    createLeadFixture(),
    createLeadFixture({
      id: 'lead-2',
      business_name: 'Espaço Bella',
      city: 'Recife',
      state: 'PE',
      phone: null,
      phone_e164: null,
      has_phone: false,
      has_own_website: true,
      website_type: 'own_domain',
      website_url: 'https://espacobella.com.br',
      google_maps_opportunity: false,
      website_opportunity: true,
      dual_opportunity: false,
      overall_score: 65,
      priority: 'medium',
      pipeline_status: 'qualified',
      qualification_status: 'qualified',
      recommended_offer: 'website',
    }),
  ]

  it('calcula indicadores alinhados ao novo pipeline', () => {
    const analytics = getLeadAnalytics(leads)

    expect(analytics.total).toBe(2)
    expect(analytics.contactableRate).toBe(50)
    expect(analytics.readyToContact).toBe(1)
    expect(analytics.qualified).toBe(1)
    expect(analytics.highPriority).toBe(1)
    expect(analytics.averageOverallScore).toBe(78)
  })

  it('filtra por texto, prioridade, oportunidade e pipeline', () => {
    expect(
      filterLeads(leads, {
        query: 'recife',
        priority: 'medium',
        opportunity: 'website',
        status: 'qualified',
      }),
    ).toEqual([leads[1]])

    expect(
      filterLeads(leads, {
        query: '',
        priority: 'all',
        opportunity: 'ready_to_contact',
        status: 'all',
      }),
    ).toEqual([leads[0]])
  })
})
