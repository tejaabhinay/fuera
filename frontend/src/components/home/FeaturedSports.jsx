import { useMemo, useState } from 'react'
import SectionHeading from '../common/SectionHeading'
import SportCard from './SportCard'
import SportRulesModal from './SportRulesModal'
import { useApiResource } from '../../hooks/useApiResource'
import { getSportStats } from '../../lib/fixtures'

export default function FeaturedSports({ fixtures = [] }) {
  const { data, loading, error } = useApiResource('/api/sports', {
    errorMessage: 'Unable to load sports. Please try again.',
  })
  const [selectedSport, setSelectedSport] = useState(null)

  const sports = useMemo(() => data?.sports || [], [data])
  const statsBySport = useMemo(() => {
    const map = new Map()
    for (const sport of sports) map.set(sport._id, getSportStats(fixtures, sport.name))
    return map
  }, [sports, fixtures])

  if (loading || error || sports.length === 0) return null

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
      </section>

      {selectedSport && <SportRulesModal sport={selectedSport} onClose={() => setSelectedSport(null)} />}
    </>
  )
}

