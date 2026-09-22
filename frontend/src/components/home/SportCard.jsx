import SportsImage from '../common/SportsImage'
import { formatDay, formatTime, isToday } from '../../lib/fixtures'
import { getSportContacts } from '../../data/sportContacts'
import { getPublicSportName } from '../../data/sportRules'
import { sportGender } from '../../data/sportGender'

const LOCAL_SPORT_IMAGES = {
  handball: '/images/sports/handball.png',
  volleyball: '/images/sports/volleyball.png',
}

function Artwork({ sport, displayName }) {
  const sportKey = sport.name?.trim().toLowerCase()
  const imageSrc = LOCAL_SPORT_IMAGES[sportKey] || sport.imageUrl

  if (!imageSrc) {
    return (
      <div className="sport-card__placeholder" role="img" aria-label={`${displayName} image coming soon`}>
        <span>{displayName}</span>
      </div>
    )
  }

  return <SportsImage src={imageSrc} alt="" className="event-image" />
}

function Captains({ sportName }) {
  const contacts = getSportContacts(sportName)
  if (!contacts || !contacts.captains.length) return null

  return (
    <div className="sport-in-charge">
      {contacts.captains.map((person) => (
        <div className="sport-in-charge__person" key={person.name}>
          <span>{person.name}</span>
          <a href={`tel:${person.contact}`}>{person.contact}</a>
        </div>
      ))}
    </div>
  )
}

/** The match-aware strip: event count plus whichever of next/latest exists. */
function SportStats({ stats }) {
  if (!stats.total) return null

  const next = stats.next
  const latest = stats.latestResult

  return (
    <dl className="sport-card__stats">
      <div className="sport-card__stat">
        <dt>Events</dt>
        <dd>{stats.total}</dd>
      </div>

      {next && (
        <div className="sport-card__stat sport-card__stat--wide">
          <dt>Next</dt>
          <dd>{isToday(next.date) ? 'Today' : formatDay(next.date)} · {formatTime(next)}</dd>
        </div>
      )}

      {!next && latest && (
        <div className="sport-card__stat sport-card__stat--wide">
          <dt>Latest</dt>
          <dd>{latest.scoreA}–{latest.scoreB} · {formatDay(latest.date)}</dd>
        </div>
      )}
    </dl>
  )
}

export default function SportCard({ sport, index, stats, onOpen, featured = false }) {
  const displayName = getPublicSportName(sport.name)
  const gender = sportGender[sport.name] || sportGender[sport.name.replace(/\s+/g, '')]

  return (
    <article
      className={`event-card event-card--interactive ${featured ? 'event-card--featured' : ''}`.trim()}
      data-live={stats.live > 0 ? 'true' : undefined}
    >
      <div className="event-image-wrap">
        <Artwork sport={sport} displayName={displayName} />
        <span className="event-tag">{String(index + 1).padStart(2, '0')}</span>
        {stats.live > 0 && (
          <span className="event-live">
            <span className="event-live__dot" aria-hidden="true" />
            Live
          </span>
        )}
      </div>

      <div className="event-copy">
        <div className="sport-card__title">
          <h3>
            {/* Covers the card through ::after so the whole card is clickable while
                the captains' tel: links stay siblings, not nested interactives. */}
            <button className="event-card__action" type="button" onClick={() => onOpen(sport)}>
              {displayName}
              <span className="sr-only"> — view rules and register</span>
            </button>
          </h3>
          {gender && <span className="sport-card__gender">{gender}</span>}
        </div>

        <SportStats stats={stats} />
        <Captains sportName={sport.name} />
      </div>
    </article>
  )
}
