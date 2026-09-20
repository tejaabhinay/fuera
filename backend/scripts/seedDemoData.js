/*
 * Demo data for local development and design review.
 *
 *   node scripts/seedDemoData.js          insert demo fixtures + leaderboard
 *   node scripts/seedDemoData.js --clean  remove everything this script inserted
 *
 * Only ever touches documents tagged with DEMO_MARKER, so it cannot disturb
 * real content. It does not touch sports, timeline events or archive photos.
 */
const path = require('node:path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const Fixture = require('../models/Fixture')
const LeaderboardEntry = require('../models/LeaderboardEntry')

const DEMO_MARKER = '[demo]'

function at(dayOffset, hours, minutes = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hours, minutes, 0, 0)
  return date
}

function hhmm(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function fixture(sport, round, teamA, teamB, date, venue, status, scoreA, scoreB) {
  return {
    sport,
    round,
    teamA,
    teamB,
    date,
    time: hhmm(date),
    venue,
    status,
    ...(scoreA === undefined ? {} : { scoreA, scoreB }),
    notes: DEMO_MARKER,
  }
}

const demoFixtures = [
  // Live right now — drives the LIVE NOW section.
  fixture('basketball', "Men's Semi Final", 'Bioinformatics', 'CSE', at(0, 10, 30), 'Main Court', 'live', 48, 42),
  fixture('kabaddi', 'Quarter Final', 'Mechanical', 'Civil', at(0, 11, 0), 'Kabaddi Ground', 'live', 26, 24),

  // Today and tomorrow — drives NEXT MATCH and the fixtures schedule.
  fixture('football', 'Semi Final', 'ECE', 'Chemical', at(0, 16, 30), 'Main Ground', 'upcoming'),
  fixture('volleyball', "Women's Semi Final", 'Biotechnology', 'IT', at(0, 17, 45), 'Indoor Arena', 'upcoming'),
  fixture('cricket', 'League Match', 'EEE', 'Bioinformatics', at(1, 9, 0), 'Cricket Ground', 'upcoming'),
  fixture('badminton', "Men's Doubles QF", 'CSE', 'Mechanical', at(1, 14, 0), 'Shuttle Court 2', 'upcoming'),
  fixture('tennis', "Women's Singles SF", 'Chemical', 'ECE', at(2, 10, 15), 'Tennis Court', 'upcoming'),
  fixture('table tennis', 'Quarter Final', 'IT', 'Civil', at(2, 15, 30), 'Indoor Arena', 'upcoming'),
  fixture('handball', 'League Match', 'Biotechnology', 'EEE', at(3, 11, 0), 'Handball Court', 'upcoming'),
  fixture('throwball', "Women's Final", 'CSE', 'Biotechnology', at(3, 16, 0), 'Indoor Arena', 'upcoming'),

  // Completed — drives RESULTS.
  fixture('football', 'Final', 'Bioinformatics', 'CSE', at(-1, 17, 0), 'Main Ground', 'completed', 2, 1),
  fixture('basketball', 'Quarter Final', 'Mechanical', 'IT', at(-1, 15, 0), 'Main Court', 'completed', 61, 55),
  fixture('cricket', 'League Match', 'Civil', 'Chemical', at(-2, 9, 30), 'Cricket Ground', 'completed', 148, 132),
  fixture('volleyball', 'Quarter Final', 'ECE', 'EEE', at(-2, 14, 0), 'Indoor Arena', 'completed', 3, 1),
  fixture('chess', 'Round 4', 'Bioinformatics', 'Mechanical', at(-3, 10, 0), 'Seminar Hall', 'completed', 3, 1),
  fixture('kabaddi', 'League Match', 'CSE', 'Civil', at(-3, 16, 30), 'Kabaddi Ground', 'completed', 38, 30),

  // Edge cases worth designing against.
  fixture('badminton', 'League Match', 'Electronics & Communication Engineering', 'Computer Science & Engineering', at(4, 12, 0), 'Shuttle Court 1', 'upcoming'),
  fixture('carrom', 'Quarter Final', 'IT', 'Chemical', at(2, 13, 0), 'Recreation Room', 'postponed'),
]

const demoLeaderboard = [
  { department: 'Bioinformatics', gold: 6, silver: 3, bronze: 2 },
  { department: 'CSE', gold: 5, silver: 4, bronze: 3 },
  { department: 'Mechanical', gold: 4, silver: 2, bronze: 4 },
  { department: 'ECE', gold: 3, silver: 5, bronze: 1 },
  { department: 'IT', gold: 3, silver: 2, bronze: 5 },
  { department: 'Civil', gold: 2, silver: 3, bronze: 3 },
  { department: 'Biotechnology', gold: 2, silver: 3, bronze: 3 },
  { department: 'Chemical', gold: 1, silver: 4, bronze: 2 },
  { department: 'EEE', gold: 1, silver: 1, bronze: 4 },
]

async function clean() {
  const fixtures = await Fixture.deleteMany({ notes: DEMO_MARKER })
  const leaderboard = await LeaderboardEntry.deleteMany({ department: { $in: demoLeaderboard.map((e) => e.department) } })
  console.log(`Removed ${fixtures.deletedCount} demo fixtures and ${leaderboard.deletedCount} leaderboard entries.`)
}

async function seed() {
  await Fixture.deleteMany({ notes: DEMO_MARKER })
  const fixtures = await Fixture.insertMany(demoFixtures)

  let leaderboardCount = 0
  for (const entry of demoLeaderboard) {
    await LeaderboardEntry.updateOne({ department: entry.department }, { $set: entry }, { upsert: true })
    leaderboardCount += 1
  }

  console.log(`Inserted ${fixtures.length} demo fixtures and ${leaderboardCount} leaderboard entries.`)
  console.log('Remove them again with: node scripts/seedDemoData.js --clean')
}

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set. Fill in backend/.env first.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
  if (process.argv.includes('--clean')) await clean()
  else await seed()
  await mongoose.connection.close()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
