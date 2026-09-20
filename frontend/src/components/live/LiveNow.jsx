import LiveMatchCard from './LiveMatchCard'

/**
 * Hidden entirely when nothing is live — an empty "no live matches" shell is
 * noise on a site that spends most of its life between events.
 */
export default function LiveNow({ fixtures }) {
  if (!fixtures.length) return null

  const [featured, ...rest] = fixtures

  return (
    <section className="live-now section-wrap" id="live" aria-labelledby="live-heading">
      <div className="live-now__head">
        <h2 id="live-heading" className="live-now__title">
          <span className="live-now__dot" aria-hidden="true" />
          Live now
        </h2>
        <span className="live-now__count">
          {fixtures.length} {fixtures.length === 1 ? 'match' : 'matches'} in play
        </span>
      </div>

      <div className={`live-now__grid ${rest.length ? '' : 'live-now__grid--single'}`.trim()}>
        <LiveMatchCard fixture={featured} featured />
        {rest.map((fixture) => (
          <LiveMatchCard fixture={fixture} key={fixture._id} />
        ))}
      </div>
    </section>
  )
}
