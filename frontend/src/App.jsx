import { useEffect } from 'react'
import './App.css'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminFixturesPage from './pages/admin/AdminFixturesPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminTimelinePage from './pages/admin/AdminTimelinePage'
import AdminSportsPage from './pages/admin/AdminSportsPage'
import AdminSignupPage from './pages/admin/AdminSignupPage'
import AdminAdminsPage from './pages/admin/AdminAdminsPage'
import AdminArchivePage from './pages/admin/AdminArchivePage'
import FixturesPage from './pages/FixturesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { getAuthToken, redirectToAdminLogin } from './services/api'

function AdminProtectedRoute({ children }) {
  const hasToken = Boolean(getAuthToken())

  useEffect(() => {
    if (!hasToken) redirectToAdminLogin()
  }, [hasToken])

  if (!hasToken) return <main className="admin-route-loading">Checking access…</main>
  return <AdminLayout>{children}</AdminLayout>
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'

  if (pathname === '/admin/login') return <AdminLoginPage />
  if (pathname === '/admin/signup') return <AdminSignupPage />
  if (pathname === '/admin') return <AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>
  if (pathname === '/admin/fixtures') return <AdminProtectedRoute><AdminFixturesPage /></AdminProtectedRoute>
  if (pathname === '/admin/timeline') return <AdminProtectedRoute><AdminTimelinePage /></AdminProtectedRoute>
  if (pathname === '/admin/sports') return <AdminProtectedRoute><AdminSportsPage /></AdminProtectedRoute>
  if (pathname === '/admin/admins') return <AdminProtectedRoute><AdminAdminsPage /></AdminProtectedRoute>
  if (pathname === '/admin/archive') return <AdminProtectedRoute><AdminArchivePage /></AdminProtectedRoute>
  if (pathname === '/') return <HomePage />
  if (pathname === '/fixtures') return <FixturesPage />
  return <NotFoundPage />
}

export default App
