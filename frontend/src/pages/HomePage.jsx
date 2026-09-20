import { useMemo } from 'react'
import BroadcastBanner from '../components/common/BroadcastBanner'
import EventContacts from '../components/home/EventContacts'
import FeaturedSports from '../components/home/FeaturedSports'
import HeroSection from '../components/home/HeroSection'
import LeaderboardSection from '../components/leaderboard/LeaderboardSection'
import LiveNow from '../components/live/LiveNow'
import PreviousEditions from '../components/home/PreviousEditions'
import ResultsSection from '../components/results/ResultsSection'
import TimelineSection from '../components/home/TimelineSection'
import Footer from '../components/layout/Footer'
import SiteHeader from '../components/layout/SiteHeader'
import { useApiResource } from '../hooks/useApiResource'
import { getLiveFixtures, getNextFixture, getResults } from '../lib/fixtures'

export default function HomePage() {
  // One fixtures request feeds the live strip, the next-match banner, the
  // per-sport stats and the results grid.
  const { data } = useApiResource('/api/fixtures', {
    errorMessage: 'Unable to load the match schedule.',
  })

  const fixtures = useMemo(() => data?.fixtures || [], [data])
  const live = useMemo(() => getLiveFixtures(fixtures), [fixtures])
  const results = useMemo(() => getResults(fixtures), [fixtures])
  const next = useMemo(() => getNextFixture(fixtures), [fixtures])

  return (
    <main className="site-shell">
      <SiteHeader isHome />
      <HeroSection hasLive={live.length > 0} />
      <LiveNow fixtures={live} />
      <FeaturedSports fixtures={fixtures} />
      <BroadcastBanner fixture={next} />
      <ResultsSection results={results} />
      <LeaderboardSection />
      <TimelineSection />
      <PreviousEditions />
      <EventContacts />
      <Footer />
    </main>
  )
}
