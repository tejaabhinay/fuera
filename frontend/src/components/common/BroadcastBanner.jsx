import { Clock, MapPin } from 'lucide-react'
import { formatDay, formatTime, isToday, toSportLabel } from '../../lib/fixtures'

/**
 * The full-bleed broadcast interstitial between sections. Used sparingly — once
 * on the homepage — so it keeps its impact.
 */
export default function BroadcastBanner({ fixture, label = 'Next match' }) {
  if (!fixture) return null

  const when = isToday(fixture.date) ? 'Today' : formatDay(fixture.date)

  return (
    <section className="broadcast" aria-labelledby="broadcast-heading">
      <div className="broadcast__inner section-wrap">
        <p className="broadcast__label">
          <span className="broadcast__label-rule" aria-hidden="true" />
          {label}
        </p>

        <h2 id="broadcast-heading" className="broadcast__sport">
          {toSportLabel(fixture.sport)}
          {fixture.round && <span className="broadcast__round">{fixture.round}</span>}
        </h2>

        <div className="broadcast__matchup">
          <span className="broadcast__team">{fixture.teamA || 'TBD'}</span>
          <span className="broadcast__versus" aria-hidden="true">vs</span>
          <span className="broadcast__team">{fixture.teamB || 'TBD'}</span>
        </div>

        <dl className="broadcast__meta">
          <div className="broadcast__meta-item">
            <dt><Clock size={13} aria-hidden="true" /> When</dt>
            <dd>{when} · {formatTime(fixture)}</dd>
          </div>
          {fixture.venue && (
            <div className="broadcast__meta-item">
              <dt><MapPin size={13} aria-hidden="true" /> Venue</dt>
              <dd>{fixture.venue}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}
