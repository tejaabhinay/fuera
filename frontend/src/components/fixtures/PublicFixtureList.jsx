import BracketColumn from './BracketColumn'
import { getSportById } from '../../data/sports'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function titleCase(value) {
  return value ? value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') : 'Sport'
}

function groupFixtures(fixtures) {
  return fixtures.reduce((groups, fixture) => {
    const sportId = String(fixture.sport || '').toLowerCase()
    const sportGroup = groups.find((group) => group.sportId === sportId)
    if (sportGroup) sportGroup.fixtures.push(fixture)
    else groups.push({ sportId, fixtures: [fixture] })
    return groups
  }, [])
}

function buildRounds(fixtures) {
  return fixtures.reduce((rounds, fixture) => {
    const name = fixture.round || 'Scheduled match'
    const round = rounds.find((item) => item.name === name)
    const match = {
      id: fixture._id?.slice(-6) || 'match',
      date: formatDate(fixture.date),
      time: fixture.time,
      venue: fixture.venue,
      status: fixture.status,
      teams: [
        { name: fixture.teamA || null, score: fixture.scoreA },
        { name: fixture.teamB || null, score: fixture.scoreB },
      ],
    }
    if (round) round.matches.push(match)
    else rounds.push({ name, matches: [match] })
    return rounds
  }, [])
}

export default function PublicFixtureList({ fixtures }) {
  return (
    <div className="public-fixture-list">
      {groupFixtures(fixtures).map(({ sportId, fixtures: sportFixtures }) => {
        const sport = getSportById(sportId)
        return (
          <section className="public-fixture-board" aria-labelledby={`fixtures-${sportId}`} key={sportId}>
            <div className="bracket-board-heading">
              <h2 id={`fixtures-${sportId}`}>{sport?.name || titleCase(sportId)} <span>/ Published schedule</span></h2>
              <p>Match details and bracket updates</p>
            </div>
            <div className="bracket-board">
              {buildRounds(sportFixtures).map((round) => <BracketColumn round={round} sportName={sport?.name || titleCase(sportId)} key={round.name} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}
