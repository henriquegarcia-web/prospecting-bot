import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import {
  createMemoryRouter,
  RouterProvider,
} from 'react-router-dom'

import '@/lib/i18n'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/auth-context'
import {
  useLeadsDashboard,
  useUpdateLeadPipelineStatus,
} from '@/hooks/use-leads-dashboard'
import { LeadsPage } from '@/pages/LeadsPage'
import { OpportunitiesPage } from '@/pages/OpportunitiesPage'
import { OverviewPage } from '@/pages/OverviewPage'
import { createLeadFixture } from '@/tests/fixtures/lead'

vi.mock('@/hooks/use-leads-dashboard', () => ({
  useLeadsDashboard: vi.fn(),
  useUpdateLeadPipelineStatus: vi.fn(),
}))

vi.mock('@/contexts/auth-context', () => ({
  useAuth: vi.fn(),
}))

function renderDashboard(initialPath = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: 'oportunidades', element: <OpportunitiesPage /> },
          { path: 'leads', element: <LeadsPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('rotas do dashboard', () => {
  let mutatePipelineStatus: ReturnType<typeof vi.fn>

  beforeEach(() => {
    const firstLead = createLeadFixture()
    const secondLead = createLeadFixture({
      id: 'lead-2',
      business_name: 'Studio Recife',
      city: 'Recife',
      state: 'PE',
      priority: 'high',
      overall_score: 82,
      pipeline_status: 'qualified',
    })

    vi.mocked(useAuth).mockReturnValue({
      isLoading: false,
      session: null,
      signIn: vi.fn(),
      signOut: vi.fn(),
      user: { email: 'admin@empresa.com' },
    } as unknown as ReturnType<typeof useAuth>)

    vi.mocked(useLeadsDashboard).mockReturnValue({
      data: {
        leads: [firstLead, secondLead],
        metrics: {
          total_leads: 2,
          nail_leads: 2,
          contactable_leads: 1,
          own_website_leads: 0,
          social_only_leads: 2,
          link_in_bio_leads: 0,
          booking_platform_leads: 0,
          hosted_website_leads: 0,
          no_website_leads: 2,
          google_maps_opportunities: 2,
          website_opportunities: 2,
          dual_opportunities: 2,
          hot_leads: 1,
          high_leads: 1,
          high_potential_leads: 2,
          eligible_leads: 2,
          new_leads: 1,
          qualified_leads: 1,
        },
        queue: [firstLead],
        total: 2,
        sampled: false,
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useLeadsDashboard>)

    mutatePipelineStatus = vi.fn()
    vi.mocked(useUpdateLeadPipelineStatus).mockReturnValue({
      isError: false,
      isPending: false,
      isSuccess: false,
      mutate: mutatePipelineStatus,
      reset: vi.fn(),
    } as unknown as ReturnType<typeof useUpdateLeadPipelineStatus>)
  })

  it('oferece somente visão geral, oportunidades e base de leads', async () => {
    const router = renderDashboard()

    expect(screen.getByRole('heading', { name: 'Operação de prospecção' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Qualidade/ })).not.toBeInTheDocument()

    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Seções do dashboard' }))
        .getByRole('link', { name: 'Oportunidades' }),
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/oportunidades')
      expect(screen.getByRole('heading', { name: 'Oportunidades' })).toBeInTheDocument()
      expect(screen.getByText('Pendentes de abordagem')).toBeInTheDocument()
    })

    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Seções do dashboard' }))
        .getByRole('link', { name: 'Base de leads' }),
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/leads')
      expect(screen.getByRole('table', { name: 'Leads para operação' })).toBeInTheDocument()
    })

    fireEvent.change(screen.getAllByLabelText('Status do pipeline')[0], {
      target: { value: 'qualified' },
    })
    expect(mutatePipelineStatus).toHaveBeenCalledWith({
      leadId: 'lead-1',
      pipelineStatus: 'qualified',
    })

    fireEvent.click(screen.getByRole('button', { name: 'Abrir dossiê de Studio Aurora' }))
    expect(screen.getByRole('dialog', { name: 'Studio Aurora' })).toBeInTheDocument()
    expect(screen.getByText('Condução da abordagem')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Fechar detalhes do lead' }))
  })
})
