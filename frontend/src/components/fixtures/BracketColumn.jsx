import MatchCard from './MatchCard'

export default function BracketColumn({ round, sportName }) {
  return (
    <div className="bracket-column">
      <h3 className="bracket-column__title">{round.name}</h3>
      <div className="bracket-column__matches">
        {round.matches.map((match) => (
          <MatchCard match={match} roundName={round.name} sportName={sportName} key={match.id} />
        ))}
      </div>
    </div>
  )
}
