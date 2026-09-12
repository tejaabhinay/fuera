import EventContacts from '../components/home/EventContacts'
import FeaturedSports from '../components/home/FeaturedSports'
import HeroSection from '../components/home/HeroSection'
import PreviousEditions from '../components/home/PreviousEditions'
import TimelineSection from '../components/home/TimelineSection'
import Footer from '../components/layout/Footer'
import SiteHeader from '../components/layout/SiteHeader'

export default function HomePage() {
  return (
    <main className="site-shell">
      <SiteHeader isHome />
      <HeroSection />
      <PreviousEditions />
      <FeaturedSports />
      <TimelineSection />
      <EventContacts />
      <Footer />
    </main>
  )
}
