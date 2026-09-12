import { useEffect, useState } from 'react'
import ArrowIcon from '../common/ArrowIcon'
import BrandLockup from '../common/BrandLockup'

export default function SiteHeader({ isHome = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const homeLink = isHome ? '#top' : '/'
  const sportsLink = isHome ? '#sports' : '/#sports'

  useEffect(() => {
    if (!menuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header">
      <a className="nav-brand" href={homeLink} onClick={closeMenu} aria-label="Fuera home">
        <span className="public-brand">
          <span className="brand-eligibility">ONLY FOR SASTRA STUDENTS</span>
          <BrandLockup />
          <span className="brand-fest">INTRA-COLLEGE SPORTS FEST</span>
        </span>
      </a>
      <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((isOpen) => !isOpen)}>
        <span className="menu-label">Menu</span>
        <span className="menu-lines" aria-hidden="true"><i /><i /></span>
      </button>
      <nav id="main-navigation" className={`main-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        <a href={sportsLink} onClick={closeMenu}>Sports</a>
        <a href="/fixtures" onClick={closeMenu}>Fixtures</a>
        <a href={isHome ? '#archive' : '/#archive'} onClick={closeMenu}>Archive</a>
        <a href={isHome ? '#contact' : '/#contact'} onClick={closeMenu}>Contact</a>
        <a className="nav-cta" href={sportsLink} onClick={closeMenu}>Register now <ArrowIcon /></a>
      </nav>
    </header>
  )
}
