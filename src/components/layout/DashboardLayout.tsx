import { useDeferredValue, useMemo, useState } from 'react'
import {
  NavLink,
  Outlet,
  useLocation,
} from 'react-router-dom'
import {
  LuLayoutDashboard,
  LuLogOut,
  LuMenu,
  LuRefreshCw,
  LuSparkles,
  LuTarget,
  LuUsers,
  LuUserRound,
  LuX,
} from 'react-icons/lu'

import {
  initialDashboardFilters,
  type DashboardOutletContext,
} from '@/contexts/dashboard-context'
import { useAuth } from '@/contexts/auth-context'
import { useLeadsDashboard } from '@/hooks/use-leads-dashboard'
import {
  filterLeads,
  getLeadAnalytics,
  type LeadFilters,
} from '@/utils/lead-analytics'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const routeTitles: Record<string, string> = {
  '/': 'Central de operação',
  '/oportunidades': 'Oportunidades',
  '/leads': 'Base de leads',
}

function getLastUpdateLabel(dates: string[]) {
  const timestamps = dates
    .map((date) => new Date(date).getTime())
    .filter((timestamp) => !Number.isNaN(timestamp))

  if (!timestamps.length) return 'Sem atualização registrada'
  return `Atualizado em ${dateFormatter.format(new Date(Math.max(...timestamps)))}`
}

function navClassName({ isActive }: { isActive: boolean }) {
  return `nav-item${isActive ? ' nav-item--active' : ''}`
}

export function DashboardLayout() {
  const [filters, setFilters] = useState<LeadFilters>(initialDashboardFilters)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const { signOut, user } = useAuth()
  const deferredQuery = useDeferredValue(filters.query)
  const dashboardQuery = useLeadsDashboard()
  const location = useLocation()

  const effectiveFilters = useMemo(
    () => ({
      query: deferredQuery,
      priority: filters.priority,
      opportunity: filters.opportunity,
      status: filters.status,
    }),
    [
      deferredQuery,
      filters.opportunity,
      filters.priority,
      filters.status,
    ],
  )
  const filteredLeads = useMemo(
    () => filterLeads(dashboardQuery.data?.leads ?? [], effectiveFilters),
    [dashboardQuery.data?.leads, effectiveFilters],
  )
  const analytics = useMemo(
    () => getLeadAnalytics(filteredLeads),
    [filteredLeads],
  )
  const hasActiveFilters =
    filters.query !== ''
    || filters.priority !== 'all'
    || filters.opportunity !== 'all'
    || filters.status !== 'all'
  const lastUpdated = getLastUpdateLabel(
    (dashboardQuery.data?.leads ?? []).map((lead) => lead.updated_at),
  )
  const outletContext: DashboardOutletContext = {
    analytics,
    clearFilters: () => setFilters(initialDashboardFilters),
    dashboardQuery,
    filteredLeads,
    filters,
    hasActiveFilters,
    setFilters,
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)
  const handleSignOut = async () => {
    setIsSigningOut(true)
    setLogoutError(null)

    try {
      await signOut()
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : 'Não foi possível sair.',
      )
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <span className="brand__mark" aria-hidden="true"><LuSparkles /></span>
          <div><strong>Prospect</strong><span>Intelligence</span></div>
        </div>
        <button
          className="sidebar__close"
          type="button"
          onClick={closeMobileMenu}
          aria-label="Fechar menu"
        >
          <LuX />
        </button>

        <nav className="sidebar__nav" aria-label="Seções do dashboard">
          <span className="nav-caption">Operação</span>
          <NavLink end className={navClassName} to="/" onClick={closeMobileMenu}>
            <LuLayoutDashboard /> Visão geral
          </NavLink>
          <NavLink className={navClassName} to="/oportunidades" onClick={closeMobileMenu}>
            <LuTarget /> Oportunidades
          </NavLink>
          <NavLink className={navClassName} to="/leads" onClick={closeMobileMenu}>
            <LuUsers /> Base de leads
          </NavLink>
        </nav>

        <div className="sidebar__status">
          <span className={`status-dot ${dashboardQuery.isError ? 'status-dot--error' : ''}`} />
          <div>
            <strong>{dashboardQuery.isError ? 'Conexão indisponível' : 'Dados do Supabase'}</strong>
            <span>{lastUpdated}</span>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
          >
            <LuMenu />
          </button>
          <div className="topbar__title">
            <span>Operação de prospecção</span>
            <strong>{routeTitles[location.pathname] ?? 'Prospect Intelligence'}</strong>
          </div>
          <div className="topbar__actions">
            <span className="data-source-badge" title={user?.email ?? undefined}>
              <LuUserRound /> {user?.email ?? 'Usuário autenticado'}
            </span>
            <button
              className="ui-button ui-button--outlined ui-button--small"
              type="button"
              disabled={dashboardQuery.isFetching}
              onClick={() => void dashboardQuery.refetch()}
            >
              <LuRefreshCw className={dashboardQuery.isFetching ? 'is-spinning' : ''} /> Atualizar
            </button>
            <button
              className="ui-button ui-button--text ui-button--small topbar__logout"
              type="button"
              disabled={isSigningOut}
              onClick={() => void handleSignOut()}
            >
              <LuLogOut /> {isSigningOut ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        </header>

        {logoutError ? <div className="topbar-error ui-message ui-message--error" role="alert">{logoutError}</div> : null}

        <main className="dashboard-content">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  )
}
