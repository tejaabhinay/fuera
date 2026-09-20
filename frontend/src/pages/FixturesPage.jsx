import { useMemo, useState } from 'react'
import FilterBar from '../components/fixtures/FilterBar'
import FixtureCard from '../components/fixtures/FixtureCard'
import SectionHeading from '../components/common/SectionHeading'
import Footer from '../components/layout/Footer'
import SiteHeader from '../components/layout/SiteHeader'
import { useApiResource } from '../hooks/useApiResource'
import {
  formatFullDay,
  formatWeekday,
  getFixtureSports,
  groupByDay,
  isToday,
  toSportId,
} from '../lib/fixtures'

const STATUS_OPTIONS = [
  { id: 'all', name: 'All' },
  { id: 'live', name: 'Live' },
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'completed', name: 'Results' },
]

const INITIAL_FILTERS = { sport: 'all', status: 'all', day: 'all' }

function FixturesSkeleton() {
  return (
    <div className="fixture-skeleton" role="status" aria-label="Loading fixtures">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="fixture-skeleton__card" key={index} />
      ))}
    </div>
  )
}

export default function FixturesPage() {
  const { data, loading, error, reload } = useApiResource('/api/fixtures', {
    errorMessage: 'Unable to load fixtures. Please try again.',
  })
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const fixtures = useMemo(() => data?.fixtures || [], [data])
  const sportOptions = useMemo(
    () => [{ id: 'all', name: 'All sports' }, ...getFixtureSports(fixtures)],
    [fixtures],
  )

  const dayOptions = useMemo(() => {
    const days = groupByDay(fixtures).map((day) => ({
      id: day.key,
      name: day.date ? (isToday(day.date) ? 'Today' : `${formatWeekday(day.date)} ${day.date.getDate()}`) : 'TBC',
      count: day.fixtures.length,
    }))
    return [{ id: 'all', name: 'All days' }, ...days]
  }, [fixtures])

  const statusOptions = useMemo(() => {
    const counts = fixtures.reduce((tally, fixture) => {
      tally[fixture.status] = (tally[fixture.status] || 0) + 1
      return tally
    }, {})
    // Drop a status filter entirely when nothing in the schedule uses it.
    return STATUS_OPTIONS.filter((option) => option.id === 'all' || counts[option.id])
  }, [fixtures])

  const visible = useMemo(() => {
    return fixtures.filter((fixture) => {
      if (filters.sport !== 'all' && toSportId(fixture.sport) !== filters.sport) return false
      if (filters.status !== 'all' && fixture.status !== filters.status) return false
      if (filters.day !== 'all') {
        const date = new Date(fixture.date)
        const key = Number.isNaN(date.getTime()) ? 'tbc' : date.toISOString().slice(0, 10)
        if (key !== filters.day) return false
      }
      return true
    })
  }, [fixtures, filters])

  const days = useMemo(() => groupByDay(visible), [visible])
  const filterKey = `${filters.sport}|${filters.status}|${filters.day}`
  const hasFilters = filters.sport !== 'all' || filters.status !== 'all' || filters.day !== 'all'

  return (
    <main className="site-shell subpage-shell">
      <SiteHeader />

      <div className="subpage-main fixtures-main">
        <SectionHeading
          className="fixtures-intro section-wrap"
          index="01"
          eyebrow="Game plan"
          id="fixtures-title"
          title={<>Match<br /><em>schedule.</em></>}
          intro="Every published fixture, result and live scoreline for FUERA 26–27."
        />

        {!loading && !error && fixtures.length > 0 && (
          <div className="fixtures-filters section-wrap">
            <FilterBar
              sports={sportOptions}
              days={dayOptions}
              status={statusOptions}
              filters={filters}
              onChange={setFilters}
              resultCount={visible.length}
              totalCount={fixtures.length}
            />
          </div>
        )}

        <section className="fixtures-board section-wrap" aria-label="Fixtures">
          {loading ? (
            <FixturesSkeleton />
          ) : error ? (
            <div className="state-panel" role="alert">
              <p className="state-panel__label">Schedule unavailable</p>
              <h2>Try again<br /><em>shortly.</em></h2>
              <p className="state-panel__copy">{error}</p>
              <button className="button button-primary" type="button" onClick={reload}>Retry</button>
            </div>
          ) : fixtures.length === 0 ? (
            <div className="state-panel" role="status">
              <p className="state-panel__index">/ 01</p>
              <p className="state-panel__label">Schedule update</p>
              <h2>Fixtures<br /><em>coming soon.</em></h2>
              <p className="state-panel__copy">
                Match schedules appear here as soon as the organisers publish them. Registration is open now.
              </p>
              <a className="button button-primary" href="/#sports">Browse sports</a>
            </div>
          ) : visible.length === 0 ? (
            <div className="state-panel state-panel--compact" role="status">
              <p className="state-panel__label">No matches</p>
              <h2>Nothing matches<br /><em>those filters.</em></h2>
              <button className="button button-primary" type="button" onClick={() => setFilters(INITIAL_FILTERS)}>
                Clear filters
              </button>
            </div>
          ) : (
            /* Changing the key remounts the list, which restarts the CSS enter
               animation. A JS animation library costs 44 kB gzip for the same
               fade, so this stays in CSS. */
            <div className="schedule" key={filterKey}>
              {days.map((day) => (
                <section
                  className="schedule__day"
                  key={day.key}
                  aria-label={day.date ? formatFullDay(day.date) : 'Date to be confirmed'}
                >
                  <div className="schedule__day-head">
                    <h3 className="schedule__day-title">
                      {day.date && isToday(day.date) && <span className="schedule__today">Today</span>}
                      {day.date ? formatFullDay(day.date) : 'Date to be confirmed'}
                    </h3>
                    <span className="schedule__day-count">
                      {day.fixtures.length} {day.fixtures.length === 1 ? 'match' : 'matches'}
                    </span>
                  </div>
                  <div className="schedule__grid">
                    {day.fixtures.map((fixture) => (
                      <FixtureCard fixture={fixture} showDate={false} key={fixture._id} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {hasFilters && visible.length > 0 && (
            <p className="fixtures-board__note" role="status">
              Showing {visible.length} of {fixtures.length} matches.
            </p>
          )}
        </section>
      </div>

      <Footer />
    </main>
  )
}
