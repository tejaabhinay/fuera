import ArrowIcon from '../common/ArrowIcon'
import BrandLockup from '../common/BrandLockup'

export default function Footer() {
  return (
    <footer className="site-footer section-wrap">
      <div className="footer-top">
        <BrandLockup className="footer-brand" />
        <p className="footer-credit">
          <span className="footer-credit__love"><em>Developed by</em></span>
          <span className="footer-credit__team">Team Colosseum</span>
        </p>
        <a className="footer-instagram" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Follow on Instagram <ArrowIcon /></a>
        <a className="footer-contact" href="mailto:thefuera24@gmail.com">hello@fuera.in <ArrowIcon /></a>
      </div>
    </footer>
  )
}
