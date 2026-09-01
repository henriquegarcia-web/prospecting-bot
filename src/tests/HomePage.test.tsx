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
import { useLeadsDashboard } from '@/hooks/use-leads-dashboard'
import { LeadsPage } from '@/pages/LeadsPage'
import { OpportunitiesPage } from '@/pages/OpportunitiesPage'
import { OverviewPage } from '@/pages/OverviewPage'
import { QualityPage } from '@/pages/QualityPage'
import { createLeadFixture } from '@/tests/fixtures/lead'

vi.mock('@/hooks/use-leads-dashboard', () => ({
  useLeadsDashboard: vi.fn(),
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
          { path: 'qualidade', element: <QualityPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('rotas do dashboard', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      isLoading: false,
      session: null,
      signIn: vi.fn(),
      signOut: vi.fn(),
      user: { email: 'admin@empresa.com' },
    } as unknown as ReturnType<typeof useAuth>)

    vi.mocked(useLeadsDashboard).mockReturnValue({
      data: {
        leads: [
          createLeadFixture(),
          createLeadFixture({
            id: 'lead-2',
            business_name: 'Studio Aurora',
            city: 'Recife',
            state: 'PE',
            lead_priority_score: 72,
            lead_tier: 'B+',
            status: 'contacted',
          }),
        ],
        total: 2,
        sampled: false,
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
      isFetching: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useLeadsDashboard>)
  })

  it('navega pelo menu usando paths e exibe o conteúdo de cada área', async () => {
    const router = renderDashboard()

    expect(
      screen.getByRole('heading', { name: 'Dashboard de prospecção' }),
    ).toBeInTheDocument()

    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Seções do dashboard' }))
        .getByRole('link', { name: 'Oportunidades' }),
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/oportunidades')
      expect(
        screen.getByRole('heading', { name: 'Oportunidades comerciais' }),
      ).toBeInTheDocument()
    })

    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Seções do dashboard' }))
        .getByRole('link', { name: 'Base de leads' }),
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/leads')
      expect(screen.getByRole('table', { name: 'Leads priorizados para curadoria' })).toBeInTheDocument()
    })

    fireEvent.change(
      screen.getByPlaceholderText('Buscar empresa, categoria ou cidade...'),
      { target: { value: 'empresa inexistente' } },
    )

    await waitFor(() => {
      expect(screen.getByText('Nenhum lead encontrado')).toBeInTheDocument()
    })
  })

  it('abre a rota de qualidade diretamente', () => {
    renderDashboard('/qualidade')

    expect(
      screen.getByRole('heading', { name: 'Qualidade da base' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Informações disponíveis')).toBeInTheDocument()
  })
})
