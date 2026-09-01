import type { ReactNode } from 'react'

interface KpiCardProps {
  icon: ReactNode
  label: string
  value: string
  helper: string
  tone: 'violet' | 'blue' | 'teal' | 'amber'
}

export function KpiCard({ icon, label, value, helper, tone }: KpiCardProps) {
  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <div className="kpi-card__content">
        <div className="kpi-card__topline">
          <span className="kpi-card__label">{label}</span>
          <span className="kpi-card__icon" aria-hidden="true">
            {icon}
          </span>
        </div>
        <strong className="kpi-card__value">{value}</strong>
        <span className="kpi-card__helper">{helper}</span>
      </div>
    </article>
  )
}
