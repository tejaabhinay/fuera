/**
 * Pure helpers for turning raw Fixture documents into everything the UI needs.
 * Kept free of React so the same logic serves the homepage, the fixtures page
 * and any future surface without duplication.
 */

export const STATUS_META = {
  live: { label: 'Live', tone: 'live' },
  upcoming: { label: 'Upcoming', tone: 'upcoming' },
  completed: { label: 'Result', tone: 'completed' },
  postponed: { label: 'Postponed', tone: 'off' },
  cancelled: { label: 'Cancelled', tone: 'off' },
}

export function getStatusMeta(status) {
  return STATUS_META[status] || { label: status || 'Scheduled', tone: 'off' }
}

/**
 * Sport names are free text in two places: the Sport record ("Throw Ball",
 * "Carroms") and the fixture's own sport field ("throwball", "carrom"). Matching
 * on a hyphenated slug missed those pairs, so the key strips every non
 * alphanumeric character instead. Display names always come from the raw value
 * via toSportLabel, so nothing user-facing depends on this form.
 */
export function toSportId(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function toSportLabel(value) {
  return String(value || '')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Sport'
}

export function isLive(fixture) {
  return fixture?.status === 'live'
}

export function isCompleted(fixture) {
  return fixture?.status === 'completed'
}

export function isUpcoming(fixture) {
  return fixture?.status === 'upcoming'
}

export function hasScore(fixture) {
  return typeof fixture?.scoreA === 'number' && typeof fixture?.scoreB === 'number'
}

function time(fixture) {
  const value = new Date(fixture?.date).getTime()
  return Number.isNaN(value) ? 0 : value
}

export function byDateAscending(a, b) {
  return time(a) - time(b) || String(a.time || '').localeCompare(String(b.time || ''))
}

export function byDateDescending(a, b) {
  return time(b) - time(a) || String(b.time || '').localeCompare(String(a.time || ''))
}

export function getLiveFixtures(fixtures = []) {
  return fixtures.filter(isLive).sort(byDateAscending)
}

export function getUpcomingFixtures(fixtures = []) {
  return fixtures.filter(isUpcoming).sort(byDateAscending)
}

export function getResults(fixtures = []) {
  return fixtures.filter((fixture) => isCompleted(fixture) && hasScore(fixture)).sort(byDateDescending)
}

/** The single match to headline in the "next match" broadcast banner. */
export function getNextFixture(fixtures = []) {
  const now = Date.now()
  const upcoming = getUpcomingFixtures(fixtures)
  return upcoming.find((fixture) => time(fixture) >= now) || upcoming[0] || null
}

/** Per-sport summary used by the sport cards: how many events, what's next, last result. */
export function getSportStats(fixtures = [], sportName) {
  const id = toSportId(sportName)
  const own = fixtures.filter((fixture) => toSportId(fixture.sport) === id)

  return {
    total: own.length,
    live: own.filter(isLive).length,
    next: getNextFixture(own),
    latestResult: getResults(own)[0] || null,
  }
}

/** Groups fixtures into day buckets for the schedule layout. */
export function groupByDay(fixtures = []) {
  const days = new Map()

  for (const fixture of [...fixtures].sort(byDateAscending)) {
    const date = new Date(fixture.date)
    const key = Number.isNaN(date.getTime()) ? 'tbc' : date.toISOString().slice(0, 10)
    if (!days.has(key)) days.set(key, { key, date: Number.isNaN(date.getTime()) ? null : date, fixtures: [] })
    days.get(key).fixtures.push(fixture)
  }

  return [...days.values()]
}

/** Distinct sports present in a fixture list, for the filter bar. */
export function getFixtureSports(fixtures = []) {
  const seen = new Map()
  for (const fixture of fixtures) {
    const id = toSportId(fixture.sport)
    if (id && !seen.has(id)) seen.set(id, { id, name: toSportLabel(fixture.sport) })
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
}

const dayFormatter = new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short' })
const fullDayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long' })
const weekdayFormatter = new Intl.DateTimeFormat('en', { weekday: 'short' })

export function formatDay(value) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date TBC' : dayFormatter.format(date).toUpperCase()
}

export function formatFullDay(value) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date to be confirmed' : fullDayFormatter.format(date)
}

export function formatWeekday(value) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '' : weekdayFormatter.format(date).toUpperCase()
}

export function isToday(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return false
  const now = new Date()
  return date.toDateString() === now.toDateString()
}

/** 24h strings from the admin form render as-is; anything else falls back cleanly. */
export function formatTime(fixture) {
  return fixture?.time || 'TBC'
}
