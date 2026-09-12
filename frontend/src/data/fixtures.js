// Published fixtures belong here once the sports schedule is finalised.
// Keep each fixture in the shape expected by the fixture components:
// { sportId, category, rounds: [{ name, matches: [{ id, date, time, venue, status, teams }] }] }
// Only values present in this data are rendered by the Fixtures page.
export const fixtures = []

export const getFixtureBySport = (sportId) => fixtures.find((fixture) => fixture.sportId === sportId)
