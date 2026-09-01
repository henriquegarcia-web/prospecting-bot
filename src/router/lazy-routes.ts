import { lazy } from 'react'

export const LazyDashboardLayout = lazy(() =>
  import('@/components/layout/DashboardLayout').then((module) => ({
    default: module.DashboardLayout,
  })),
)
export const LazyLeadsPage = lazy(() =>
  import('@/pages/LeadsPage').then((module) => ({ default: module.LeadsPage })),
)
export const LazyLoginPage = lazy(() =>
  import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)
export const LazyOpportunitiesPage = lazy(() =>
  import('@/pages/OpportunitiesPage').then((module) => ({
    default: module.OpportunitiesPage,
  })),
)
export const LazyOverviewPage = lazy(() =>
  import('@/pages/OverviewPage').then((module) => ({
    default: module.OverviewPage,
  })),
)
export const LazyQualityPage = lazy(() =>
  import('@/pages/QualityPage').then((module) => ({
    default: module.QualityPage,
  })),
)
