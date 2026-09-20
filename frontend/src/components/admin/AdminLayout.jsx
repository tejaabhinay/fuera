import '../../admin.css'
import BrandLockup from '../common/BrandLockup'
import { clearAuthToken } from '../../services/api'

const navigation = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/fixtures', label: 'Fixtures' },
  { href: '/admin/sports', label: 'Sports' },
  { href: '/admin/leaderboard', label: 'Standings' },
  { href: '/admin/timeline', label: 'Timeline' },
  { href: '/admin/archive', label: 'Archive' },
  { href: '/admin/admins', label: 'Administrators' },
]

export default function AdminLayout({ children }) {
  const pathname = window.location.pathname

  const handleLogout = () => {
    clearAuthToken()
    window.location.replace('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin" aria-label="FUERA admin overview">
          <BrandLockup label="Admin / 26" />
        </a>
        <div className="admin-sidebar__label">Management</div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navigation.map((item) => (
            <a className={pathname === item.href ? 'is-active' : ''} href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="admin-logout admin-sidebar__logout" type="button" onClick={handleLogout}>Log out</button>
      </aside>

      <div className="admin-content">
        <header className="admin-mobile-header">
          <a className="admin-brand" href="/admin" aria-label="FUERA admin overview">
            <BrandLockup label="Admin / 26" />
          </a>
          <button className="admin-logout" type="button" onClick={handleLogout}>Log out</button>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
