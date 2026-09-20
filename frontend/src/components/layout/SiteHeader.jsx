import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import BrandLockup from '../common/BrandLockup'
import { useScrolled } from '../../hooks/useScrolled'

export default function SiteHeader({ isHome = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(24)

  const closeMenu = () => setMenuOpen(false)

  // Anchors resolve against the homepage when we are on a subpage.
  const prefix = isHome ? '' : '/'
  const links = [
    { href: `${prefix}#sports`, label: 'Sports' },
    { href: '/fixtures', label: 'Fixtures' },
    { href: `${prefix}#archive`, label: 'Archive' },
    { href: `${prefix}#contact`, label: 'Contact' },
  ]

  useEffect(() => {
    if (!menuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu()
    }

    // Stop the page scrolling behind the open drawer.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <header className={`site-header ${isHome ? 'site-header--home' : ''} ${scrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="site-header__inner">
        <a className="nav-brand" href={isHome ? '#top' : '/'} onClick={closeMenu} aria-label="FUERA home">
          <span className="public-brand">
            <span className="brand-lockup-wrapper">
              <BrandLockup showFuera={false} />
            </span>
          </span>
        </a>

        <button
          className={`menu-toggle ${menuOpen ? 'is-open' : ''}`.trim()}
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>

        <nav
          id="main-navigation"
          className={`main-navigation ${menuOpen ? 'is-open' : ''}`.trim()}
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <a href={link.href} onClick={closeMenu} key={link.label}>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </div>

      {menuOpen && <button className="nav-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
    </header>
  )
}
