import ArrowIcon from '../components/common/ArrowIcon'
import Footer from '../components/layout/Footer'
import SiteHeader from '../components/layout/SiteHeader'

export default function NotFoundPage() {
  return (
    <main className="site-shell subpage-shell">
      <SiteHeader />
      <div className="subpage-main not-found-main">
        <section className="not-found section-wrap" aria-labelledby="not-found-title">
          <div className="section-kicker"><span>404</span><span>Wrong arena</span></div>
          <p className="not-found__code" aria-hidden="true">404</p>
          <h1 id="not-found-title">Wrong<br /><em>arena.</em></h1>
          <p className="not-found__copy">This page is out of bounds. Head back to FUERA and find your way to the game.</p>
          <a className="button button-primary" href="/">Back to FUERA <ArrowIcon /></a>
        </section>
      </div>
      <Footer />
    </main>
  )
}
