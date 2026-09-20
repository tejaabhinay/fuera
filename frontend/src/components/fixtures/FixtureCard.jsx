import { Clock, MapPin } from 'lucide-react'
import StatusPill from '../common/StatusPill'
import { formatDay, formatTime, hasScore, isToday, toSportLabel } from '../../lib/fixtures'

/**
 * The single match unit used across the fixtures page at every width. Everything
 * a visitor needs — sport, round, both teams, time, venue, status — is on the
 * face of the card; nothing is hidden behind an interaction.
 */
export default function FixtureCard({ fixture, showDate = true }) {
  const showScore = hasScore(fixture)
  const leadA = showScore && fixture.scoreA > fixture.scoreB
  const leadB = showScore && fixture.scoreB > fixture.scoreA
  const today = isToday(fixture.date)

  return (
    <article className={`fixture-card fixture-card--${fixture.status || 'upcoming'}`}>
      <header className="fixture-card__head">
        <span className="fixture-card__sport">{toSportLabel(fixture.sport)}</span>
        <StatusPill status={fixture.status} size="sm" />
      </header>

      {fixture.round && <p className="fixture-card__round">{fixture.round}</p>}

      <div className="fixture-card__teams">
        <div className={`fixture-card__team ${leadA ? 'is-leading' : ''}`.trim()}>
          <span className="fixture-card__team-name">{fixture.teamA || 'TBD'}</span>
          {showScore && <span className="fixture-card__score">{fixture.scoreA}</span>}
        </div>
        <span className="fixture-card__versus" aria-hidden="true">vs</span>
        <div className={`fixture-card__team ${leadB ? 'is-leading' : ''}`.trim()}>
          <span className="fixture-card__team-name">{fixture.teamB || 'TBD'}</span>
          {showScore && <span className="fixture-card__score">{fixture.scoreB}</span>}
        </div>
      </div>

      <footer className="fixture-card__meta">
        <span className="fixture-card__meta-item">
          <Clock size={12} aria-hidden="true" />
          {showDate && <span className={today ? 'fixture-card__today' : ''}>{today ? 'Today' : formatDay(fixture.date)}</span>}
          <span>{formatTime(fixture)}</span>
        </span>
        {fixture.venue && (
          <span className="fixture-card__meta-item fixture-card__meta-item--venue">
            <MapPin size={12} aria-hidden="true" />
            <span>{fixture.venue}</span>
          </span>
        )}
      </footer>
    </article>
  )
}
