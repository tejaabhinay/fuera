import { useMemo, useState } from 'react'
import SectionHeading from '../common/SectionHeading'
import WinnersSlider from './WinnersSlider'
import { winnersData } from '../../data/winners'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'chess', label: 'Chess' },
  { id: 'badminton', label: 'Badminton' },
  { id: 'men', label: "Men's" },
  { id: 'women', label: "Women's" },
]

export default function WinnersSection({ showHeading = true, isPage = false }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredWinners = useMemo(() => {
    if (activeFilter === 'all') return winnersData
    if (activeFilter === 'chess') return winnersData.filter((item) => item.sportKey === 'chess')
    if (activeFilter === 'badminton') return winnersData.filter((item) => item.sportKey === 'badminton')
    if (activeFilter === 'men') return winnersData.filter((item) => item.gender === 'Men')
    if (activeFilter === 'women') return winnersData.filter((item) => item.gender === 'Women')
    return winnersData
  }, [activeFilter])

  return (
    <section
      className={`winners-section section-wrap ${isPage ? 'winners-section--page' : ''}`.trim()}
      id="winners"
      aria-labelledby="winners-heading"
    >
      {showHeading && (
        <SectionHeading
          index="03"
          eyebrow="Hall of Fame"
          id="winners-heading"
          title={<>Tournament <em>winners.</em></>}
          intro="Official champions, runners-up and podium finishers for FUERA 26–27."
          action={
            <div className="winners-action-pill">
              <span className="winners-action-pill__dot" aria-hidden="true" />
              <span>{winnersData.length} Events Concluded</span>
            </div>
          }
        />
      )}

      <div className="winners-filters" role="tablist" aria-label="Filter winners by sport">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`winners-filter-chip ${isActive ? 'is-active' : ''}`.trim()}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      <WinnersSlider items={filteredWinners} key={activeFilter} />
    </section>
  )
}


