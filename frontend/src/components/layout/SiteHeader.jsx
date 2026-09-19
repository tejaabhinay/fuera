import { useEffect, useState } from 'react'
import BrandLockup from '../common/BrandLockup'

export default function SiteHeader({ isHome = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const homeLink = isHome ? '#top' : '/'
  const sportsLink = isHome ? '#sports' : '/#sports'
  const archiveLink = isHome ? '#archive' : '/#archive'
  const contactLink = isHome ? '#contact' : '/#contact'

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  return (
    <header className={`site-header ${isHome ? 'site-header--home' : ''}`}>
      <a
        className="nav-brand"
        href={homeLink}
        onClick={closeMenu}
        aria-label="FUERA home"
      >
        <span className="public-brand">

          <span className="brand-lockup-wrapper">
            <BrandLockup />
          </span>
        </span>
      </a>

      <button
        className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
        type="button"
        aria-label={
          menuOpen
            ? 'Close navigation'
            : 'Open navigation'
        }
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span className="menu-label">Menu</span>

        <span
          className="menu-lines"
          aria-hidden="true"
        >
          <i />
          <i />
        </span>
      </button>

      <nav
        id="main-navigation"
        className={`main-navigation ${
          menuOpen ? 'is-open' : ''
        }`}
        aria-label="Main navigation"
      >
        <a
          href={sportsLink}
          onClick={closeMenu}
        >
          Sports
        </a>

        <a
          href="/fixtures"
          onClick={closeMenu}
        >
          Fixtures
        </a>

        <a
          href={archiveLink}
          onClick={closeMenu}
        >
          Archive
        </a>

        <a
          href={contactLink}
          onClick={closeMenu}
        >
          Contact
        </a>

      </nav>
    </header>
  )
}
