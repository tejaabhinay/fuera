import SiteHeader from '../components/layout/SiteHeader'
import Footer from '../components/layout/Footer'
import SectionHeading from '../components/common/SectionHeading'
import WinnersSection from '../components/winners/WinnersSection'

export default function WinnersPage() {
  return (
    <main className="site-shell subpage-shell">
      <SiteHeader />

      <div className="subpage-main">
        <SectionHeading
          className="fixtures-intro section-wrap"
          index="01"
          eyebrow="Hall of Fame"
          id="winners-page-title"
          title={<>Champions &amp;<br /><em>winners.</em></>}
          intro="Official champions, runners-up and podium finishes for FUERA 26–27."
        />

        <WinnersSection showHeading={false} isPage />
      </div>

      <Footer />
    </main>
  )
}
