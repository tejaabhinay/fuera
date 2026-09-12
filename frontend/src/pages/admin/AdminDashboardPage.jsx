import { useEffect, useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import { apiRequest, getApiErrorMessage } from '../../services/api'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([apiRequest('/api/fixtures'), apiRequest('/api/timeline/admin'), apiRequest('/api/sports')])
      .then(([fixtureData, timelineData, sportData]) => {
        if (!active) return
        const fixtures = fixtureData?.fixtures || []
        const events = timelineData?.events || []
        const sports = sportData?.sports || []
        setStats({
          totalFixtures: fixtures.length,
          upcomingFixtures: fixtures.filter((fixture) => fixture.status === 'upcoming').length,
          completedFixtures: fixtures.filter((fixture) => fixture.status === 'completed').length,
          timelineEvents: events.length,
          totalSports: sports.length,
          activeSports: sports.filter((sport) => sport.isActive).length,
        })
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError, 'Unable to load dashboard data. Please try again.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-eyebrow">FUERA / Control room</span>
          <h1>Good to see you<br /><em>back.</em></h1>
        </div>
        <p>Keep the schedule clear, current, and ready for the campus.</p>
      </header>

      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <section className="admin-stat-grid" aria-label="FUERA content statistics">
        <StatCard label="Total fixtures" value={loading ? '…' : stats?.totalFixtures ?? '—'} detail="Published schedule" />
        <StatCard label="Upcoming" value={loading ? '…' : stats?.upcomingFixtures ?? '—'} detail="Status: upcoming" />
        <StatCard label="Completed" value={loading ? '…' : stats?.completedFixtures ?? '—'} detail="Status: completed" />
        <StatCard label="Timeline events" value={loading ? '…' : stats?.timelineEvents ?? '—'} detail="All admin events" />
        <StatCard label="Homepage dates" value={loading ? '…' : stats?.timelineEvents ?? '—'} detail="Visible on homepage" />
        <StatCard label="Sports" value={loading ? '…' : stats?.totalSports ?? '—'} detail={loading ? 'Registration setup' : `${stats?.activeSports ?? 0} active`} />
      </section>

      <section className="admin-quick-links" aria-labelledby="quick-links-title">
        <div>
          <span className="admin-eyebrow">Next move</span>
          <h2 id="quick-links-title">Manage the<br /><em>details.</em></h2>
        </div>
        <div className="admin-quick-links__actions">
          <a className="admin-button admin-button--primary" href="/admin/fixtures">Manage fixtures <span>→</span></a>
          <a className="admin-button admin-button--quiet" href="/admin/sports">Manage sports <span>→</span></a>
          <a className="admin-button admin-button--quiet" href="/admin/timeline">Manage timeline <span>→</span></a>
        </div>
      </section>
    </div>
  )
}
