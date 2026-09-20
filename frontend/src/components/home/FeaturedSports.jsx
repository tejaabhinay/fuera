import { useMemo, useState } from 'react'
import SectionHeading from '../common/SectionHeading'
import SportCard from './SportCard'
import SportRulesModal from './SportRulesModal'
import { useApiResource } from '../../hooks/useApiResource'
import { getSportStats } from '../../lib/fixtures'

function SportsSkeleton() {
  return (
    <div className="events-grid" role="status" aria-label="Loading sports">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="sport-skeleton" key={index}>
          <div className="sport-skeleton__image" />
          <div className="sport-skeleton__line" />
          <div className="sport-skeleton__line sport-skeleton__line--short" />
        </div>
      ))}
    </div>
  )
}

export default function FeaturedSports({ fixtures = [] }) {
  const { data, loading, error, reload } = useApiResource('/api/sports', {
    errorMessage: 'Unable to load sports. Please try again.',
  })
  const [selectedSport, setSelectedSport] = useState(null)

  const sports = useMemo(() => data?.sports || [], [data])
  const statsBySport = useMemo(() => {
    const map = new Map()
    for (const sport of sports) map.set(sport._id, getSportStats(fixtures, sport.name))
    return map
  }, [sports, fixtures])

  return (
    <>
      <section className="events section-wrap" id="sports" aria-labelledby="sports-heading">
        <SectionHeading
          index="02"
          eyebrow="Registration open"
          id="sports-heading"
          title={<>Choose your <em>game.</em></>}
          intro="Twelve sports, open to every UG, PG and PhD scholar. Pick one to read the rules and register."
        />

        {loading ? (
          <SportsSkeleton />
        ) : error ? (
          <div className="state-panel state-panel--compact" role="alert">
            <p className="state-panel__label">Sports unavailable</p>
            <h3>Could not load<br /><em>the line-up.</em></h3>
            <p className="state-panel__copy">{error}</p>
            <button className="button button-primary" type="button" onClick={reload}>Retry</button>
          </div>
        ) : sports.length === 0 ? (
          <div className="state-panel state-panel--compact" role="status">
            <p className="state-panel__label">Line-up pending</p>
            <h3>Sports open<br /><em>very soon.</em></h3>
            <p className="state-panel__copy">The full line-up appears here once registration configuration is complete.</p>
          </div>
        ) : (
          <div className="events-grid">
            {sports.map((sport, index) => (
              <SportCard
                sport={sport}
                index={index}
                stats={statsBySport.get(sport._id) || { total: 0, live: 0, next: null, latestResult: null }}
                onOpen={setSelectedSport}
                featured={index === 0 && sports.length >= 4}
                key={sport._id}
              />
            ))}
          </div>
        )}
      </section>

      {selectedSport && <SportRulesModal sport={selectedSport} onClose={() => setSelectedSport(null)} />}
    </>
  )
}
