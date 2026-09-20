import { formatDay, toSportLabel } from '../../lib/fixtures'

/**
 * Scores carry the hierarchy here: the winning side is the only element at full
 * weight, so a result reads at a glance without any extra decoration.
 */
export default function ResultCard({ fixture }) {
  const aWon = fixture.scoreA > fixture.scoreB
  const bWon = fixture.scoreB > fixture.scoreA
  const drawn = fixture.scoreA === fixture.scoreB

  return (
    <article className="result-card">
      <header className="result-card__head">
        <span className="result-card__sport">{toSportLabel(fixture.sport)}</span>
        {fixture.round && <span className="result-card__round">{fixture.round}</span>}
      </header>

      <div className="result-card__rows">
        <div className={`result-card__row ${aWon ? 'is-winner' : ''}`.trim()}>
          <span className="result-card__team">{fixture.teamA || 'TBD'}</span>
          <span className="result-card__score">{fixture.scoreA}</span>
        </div>
        <div className={`result-card__row ${bWon ? 'is-winner' : ''}`.trim()}>
          <span className="result-card__team">{fixture.teamB || 'TBD'}</span>
          <span className="result-card__score">{fixture.scoreB}</span>
        </div>
      </div>

      <footer className="result-card__foot">
        <span>{drawn ? 'Drawn' : 'Final'}</span>
        <span aria-hidden="true">·</span>
        <span>{formatDay(fixture.date)}</span>
        {fixture.venue && (
          <>
            <span aria-hidden="true">·</span>
            <span className="result-card__venue">{fixture.venue}</span>
          </>
        )}
      </footer>
    </article>
  )
}
