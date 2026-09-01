import {
  LuBadgeCheck,
  LuGlobe,
  LuMap,
} from 'react-icons/lu'

import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DashboardQueryBoundary } from '@/components/dashboard/DashboardQueryBoundary'
import { HorizontalBarList } from '@/components/dashboard/HorizontalBarList'
import { useDashboardContext } from '@/contexts/dashboard-context'

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function QualityPage() {
  const { analytics, filteredLeads } = useDashboardContext()

  return (
    <>
      <section className="page-heading" aria-labelledby="quality-title">
        <div>
          <span className="eyebrow">Confiabilidade dos dados</span>
          <h1 id="quality-title">Qualidade da base</h1>
          <p>Acompanhe a completude dos registros e identifique gaps digitais úteis para a prospecção.</p>
        </div>
        <div className="page-heading__context">
          <span>Leads avaliados</span>
          <strong>{numberFormatter.format(filteredLeads.length)}</strong>
        </div>
      </section>

      <DashboardQueryBoundary>
        <DashboardFilters />
        {filteredLeads.length ? (
          <section className="lower-grid lower-grid--page">
            <article className="dashboard-card quality-card"><div className="dashboard-card__content">
              <div className="card-heading"><div><span className="card-kicker">Completude</span><h2>Informações disponíveis</h2></div><span className="card-icon card-icon--amber"><LuBadgeCheck /></span></div>
              <p className="card-description">Percentual do recorte com cada informação disponível.</p>
              <HorizontalBarList items={analytics.completeness} total={100} valueSuffix="%" />
            </div></article>

            <article className="dashboard-card map-gap-card"><div className="dashboard-card__content">
              <div className="map-gap-card__visual" aria-hidden="true"><LuMap /><span /><span /><span /></div>
              <div className="map-gap-card__content">
                <span className="card-kicker">Sinal de oportunidade</span><h2>Perfis sem site são um recorte valioso</h2>
                <p>{analytics.noWebsiteRate}% dos leads filtrados ainda não possuem website. Combine esse sinal com tier, contato e gap do Google Maps para priorizar a abordagem.</p>
                <div className="signal-row"><span><LuGlobe /> Sem website</span><strong>{analytics.noWebsiteRate}%</strong></div>
              </div>
            </div></article>
          </section>
        ) : <DashboardEmptyState />}
      </DashboardQueryBoundary>
    </>
  )
}
