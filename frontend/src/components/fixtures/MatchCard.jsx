function TeamRow({ team }) {
  return (
    <div className={`match-card__team ${team.winner ? 'is-winner' : ''}`}>
      <span className="match-card__team-name">
        {team.name || team.placeholder || 'TBD'}
        {team.winner && <span className="match-card__trophy" aria-label="Winner" title="Winner">Winner</span>}
      </span>
      {team.score !== null && team.score !== undefined && (
        <span className="match-card__score">{team.score}</span>
      )}
    </div>
  )
}

export default function MatchCard({ match, roundName, sportName }) {
  return (
    <article className="match-card" aria-label={`${sportName}, ${roundName}, match ${match.id}`}>
      <div className="match-card__header">
        <span className="match-card__sport">{sportName}</span>
        <span className="match-card__id">{match.id}</span>
      </div>
      <p className="match-card__round">{roundName}</p>
      <div className="match-card__teams">
        {match.teams.map((team, index) => (
          <div key={`${match.id}-${index}`}>
            {index > 0 && <span className="match-card__versus">vs</span>}
            <TeamRow team={team} />
          </div>
        ))}
      </div>
      <div className="match-card__details">
        {match.date && <span><b>Date</b>{match.date}</span>}
        {match.time && <span><b>Time</b>{match.time}</span>}
        {match.venue && <span><b>Venue</b>{match.venue}</span>}
        {match.status && <span><b>Status</b>{match.status}</span>}
      </div>
    </article>
  )
}
