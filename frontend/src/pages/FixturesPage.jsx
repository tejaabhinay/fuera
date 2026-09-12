import { useEffect, useMemo, useState } from 'react'
import PublicFixtureList from '../components/fixtures/PublicFixtureList'
import SportSelector from '../components/fixtures/SportSelector'
import Footer from '../components/layout/Footer'
import SiteHeader from '../components/layout/SiteHeader'
import { getSportById } from '../data/sports'
import { apiRequest, getApiErrorMessage } from '../services/api'

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState([])
  const [selectedSportId, setSelectedSportId] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/api/fixtures', { auth: false })
      .then((data) => { if (active) setFixtures(data?.fixtures || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load fixtures. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const fixtureSports = useMemo(() => {
    const ids = [...new Set(fixtures.map((fixture) => String(fixture.sport || '').toLowerCase()))]
    return ids.map((id) => getSportById(id) || { id, name: id.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') })
  }, [fixtures])

  const visibleFixtures = selectedSportId === 'all' ? fixtures : fixtures.filter((fixture) => String(fixture.sport || '').toLowerCase() === selectedSportId)

  return (
    <main className="site-shell subpage-shell">
      <SiteHeader />
      <div className="subpage-main fixtures-main">
        <section className="fixtures-intro section-wrap" aria-labelledby="fixtures-title">
          <div className="section-kicker"><span>01</span><span>Game plan</span></div>
          <h1 id="fixtures-title">Sports <em>fixtures.</em></h1>
          <p className="fixtures-intro__copy">Published match schedules and bracket updates for the FUERA sports fest.</p>
        </section>

        {fixtureSports.length > 0 && !loading && !error && (
          <section className="fixtures-select section-wrap" aria-label="Choose a sport">
            <SportSelector sports={fixtureSports} value={selectedSportId} onChange={setSelectedSportId} includeAll />
          </section>
        )}

        <section className="fixtures-board section-wrap" aria-label="Fixtures content">
          {loading ? (
            <div className="fixtures-empty" role="status"><p className="display-label">Loading schedule</p><h2>Fixtures<br /><em>loading.</em></h2></div>
          ) : error ? (
            <div className="fixtures-empty" role="alert"><p className="display-label">Schedule unavailable</p><h2>Try again<br /><em>shortly.</em></h2><p>{error}</p></div>
          ) : visibleFixtures.length > 0 ? (
            <PublicFixtureList fixtures={visibleFixtures} />
          ) : (
            <div className="fixtures-empty" role="status">
              <p className="fixtures-empty__index">/ 01</p>
              <p className="display-label">Schedule update</p>
              <h2>Fixtures<br /><em>coming soon.</em></h2>
              <p>Fixtures will appear here once the schedule is published.</p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  )
}
