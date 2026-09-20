import { MapPin } from 'lucide-react'
import StatusPill from '../common/StatusPill'
import { hasScore, toSportLabel } from '../../lib/fixtures'

/**
 * Broadcast-style scoreline. The two team rows share a grid so scores stay on a
 * single right-aligned column no matter how long a department name runs.
 */
export default function LiveMatchCard({ fixture, featured = false }) {
  const showScore = hasScore(fixture)
  const leadA = showScore && fixture.scoreA > fixture.scoreB
  const leadB = showScore && fixture.scoreB > fixture.scoreA

  return (
    <article className={`live-card ${featured ? 'live-card--featured' : ''}`.trim()}>
      <header className="live-card__head">
        <StatusPill status="live" />
        <span className="live-card__sport">{toSportLabel(fixture.sport)}</span>
      </header>

      {fixture.round && <p className="live-card__round">{fixture.round}</p>}

      <div className="live-card__teams">
        <div className={`live-card__team ${leadA ? 'is-leading' : ''}`.trim()}>
          <span className="live-card__team-name">{fixture.teamA || 'TBD'}</span>
          {showScore && <span className="live-card__score">{fixture.scoreA}</span>}
        </div>
        <div className={`live-card__team ${leadB ? 'is-leading' : ''}`.trim()}>
          <span className="live-card__team-name">{fixture.teamB || 'TBD'}</span>
          {showScore && <span className="live-card__score">{fixture.scoreB}</span>}
        </div>
      </div>

      {fixture.venue && (
        <footer className="live-card__foot">
          <MapPin size={12} aria-hidden="true" />
          <span>{fixture.venue}</span>
        </footer>
      )}
    </article>
  )
}
