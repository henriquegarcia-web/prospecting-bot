export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-label="Carregando dashboard">
      <div className="kpi-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index} className="skeleton-block skeleton-block--kpi" />
        ))}
      </div>
      <div className="insights-grid mt-4">
        <span className="skeleton-block skeleton-block--insight" />
        <span className="skeleton-block skeleton-block--insight" />
        <span className="skeleton-block skeleton-block--insight" />
      </div>
      <span className="skeleton-block skeleton-block--table mt-4" />
    </div>
  )
}
