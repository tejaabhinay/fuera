import BracketColumn from './BracketColumn'

export default function BracketBoard({ fixture, sportName }) {
  return (
    <div className="bracket-board-wrap">
      <div className="bracket-board-heading">
        <h2>{sportName} <span>/ {fixture.category}</span></h2>
        <p>Knockout tournament bracket</p>
      </div>
      <div className="bracket-board">
        {fixture.rounds.map((round) => (
          <BracketColumn round={round} sportName={sportName} key={round.name} />
        ))}
      </div>
    </div>
  )
}
