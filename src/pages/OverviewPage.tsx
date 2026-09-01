import {
  LuBadgeCheck,
  LuBuilding2,
  LuChartNoAxesCombined,
  LuChevronRight,
  LuPhone,
  LuTarget,
  LuUsers,
} from 'react-icons/lu'
import { Link } from 'react-router-dom'

import { DashboardQueryBoundary } from '@/components/dashboard/DashboardQueryBoundary'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { useDashboardContext } from '@/contexts/dashboard-context'

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function OverviewPage() {
  const { analytics, dashboardQuery, filteredLeads } = useDashboardContext()

  return (
    <>
      <section className="page-heading" aria-labelledby="overview-title">
        <div>
          <span className="eyebrow">Inteligência comercial</span>
          <h1 id="overview-title">Dashboard de prospecção</h1>
          <p>Entenda o estado da operação e acesse cada etapa da curadoria por uma rota dedicada.</p>
        </div>
        <div className="page-heading__context">
          <span>Recorte analisado</span>
          <strong>{numberFormatter.format(filteredLeads.length)} lead{filteredLeads.length === 1 ? '' : 's'}</strong>
        </div>
      </section>

      <DashboardQueryBoundary>
        <section className="kpi-grid" aria-label="Indicadores principais">
          <KpiCard icon={<LuBuilding2 />} label="Leads na base" value={numberFormatter.format(dashboardQuery.data?.total ?? 0)} helper={`${numberFormatter.format(analytics.total)} no recorte atual`} tone="violet" />
          <KpiCard icon={<LuPhone />} label="Contatáveis" value={`${analytics.contactableRate}%`} helper={`${numberFormatter.format(analytics.contactable)} leads com contato viável`} tone="blue" />
          <KpiCard icon={<LuBadgeCheck />} label="Qualificados" value={`${analytics.qualifiedRate}%`} helper={`${numberFormatter.format(analytics.qualified)} prontos para avançar`} tone="teal" />
          <KpiCard icon={<LuChartNoAxesCombined />} label="Prioridade média" value={String(analytics.averagePriority)} helper={`${analytics.noWebsiteRate}% ainda não têm website`} tone="amber" />
        </section>

        <section className="overview-route-grid" aria-label="Áreas da operação">
          <Link className="overview-route-card" to="/oportunidades">
            <span className="card-icon card-icon--violet"><LuTarget /></span>
            <div>
              <span className="card-kicker">Priorização</span>
              <h2>Oportunidades</h2>
              <p>Compare pipeline, ofertas recomendadas e os leads mais promissores.</p>
            </div>
            <LuChevronRight aria-hidden="true" />
          </Link>
          <Link className="overview-route-card" to="/leads">
            <span className="card-icon card-icon--blue"><LuUsers /></span>
            <div>
              <span className="card-kicker">Curadoria</span>
              <h2>Base de leads</h2>
              <p>Consulte {numberFormatter.format(filteredLeads.length)} leads do recorte em uma tabela paginada.</p>
            </div>
            <LuChevronRight aria-hidden="true" />
          </Link>
          <Link className="overview-route-card" to="/qualidade">
            <span className="card-icon card-icon--teal"><LuBadgeCheck /></span>
            <div>
              <span className="card-kicker">Completude</span>
              <h2>Qualidade da base</h2>
              <p>Analise os campos disponíveis e os sinais de oportunidade digital.</p>
            </div>
            <LuChevronRight aria-hidden="true" />
          </Link>
        </section>
      </DashboardQueryBoundary>
    </>
  )
}
