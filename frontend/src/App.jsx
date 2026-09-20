import { lazy, Suspense, useEffect } from 'react'
import './App.css'
import ErrorBoundary from './components/common/ErrorBoundary'
import HomePage from './pages/HomePage'
import { getAuthToken, redirectToAdminLogin } from './services/api'

// Only the public homepage is eager. Everything else — and especially the eight admin
// pages plus admin.css — loads on demand so a visitor never downloads the admin UI.
const FixturesPage = lazy(() => import('./pages/FixturesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminSignupPage = lazy(() => import('./pages/admin/AdminSignupPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminFixturesPage = lazy(() => import('./pages/admin/AdminFixturesPage'))
const AdminTimelinePage = lazy(() => import('./pages/admin/AdminTimelinePage'))
const AdminSportsPage = lazy(() => import('./pages/admin/AdminSportsPage'))
const AdminLeaderboardPage = lazy(() => import('./pages/admin/AdminLeaderboardPage'))
const AdminAdminsPage = lazy(() => import('./pages/admin/AdminAdminsPage'))
const AdminArchivePage = lazy(() => import('./pages/admin/AdminArchivePage'))

function RouteFallback() {
  return <main className="admin-route-loading" role="status">Loading…</main>
}

function AdminProtectedRoute({ children }) {
  const hasToken = Boolean(getAuthToken())

  useEffect(() => {
    if (!hasToken) redirectToAdminLogin()
  }, [hasToken])

  if (!hasToken) return <main className="admin-route-loading">Checking access…</main>
  return <AdminLayout>{children}</AdminLayout>
}

function protectedRoute(Page) {
  return () => <AdminProtectedRoute><Page /></AdminProtectedRoute>
}

const routes = {
  '/': () => <HomePage />,
  '/fixtures': () => <FixturesPage />,
  '/admin/login': () => <AdminLoginPage />,
  '/admin/signup': () => <AdminSignupPage />,
  '/admin': protectedRoute(AdminDashboardPage),
  '/admin/fixtures': protectedRoute(AdminFixturesPage),
  '/admin/timeline': protectedRoute(AdminTimelinePage),
  '/admin/sports': protectedRoute(AdminSportsPage),
  '/admin/leaderboard': protectedRoute(AdminLeaderboardPage),
  '/admin/admins': protectedRoute(AdminAdminsPage),
  '/admin/archive': protectedRoute(AdminArchivePage),
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const renderRoute = routes[pathname] || (() => <NotFoundPage />)

  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>{renderRoute()}</Suspense>
    </ErrorBoundary>
  )
}

export default App
