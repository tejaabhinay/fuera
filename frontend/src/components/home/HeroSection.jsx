import { useEffect, useState } from 'react'
import ArrowIcon from '../common/ArrowIcon'
import { SASTRA_LOGO_SRC } from '../common/BrandLockup'

// Kept as separate lines so the typewriter never slices the string at hardcoded
// offsets; editing the copy no longer silently scrambles the line breaks.
const HERO_TAGLINE_LINES = ['THE GAME', 'STARTS', 'HERE']
const HERO_TAGLINE = HERO_TAGLINE_LINES.join(' ')
const HERO_FEST_LABEL = 'INTRA-UNIVERSITY SPORTS FEST'
const TYPE_SPEED_MS = 75
const CURSOR_DURATION_MS = 1200

/**
 * Two compositions from one DOM.
 *
 * Phones and tablets lay the athletes out as two flow rows, one above and one
 * below the copy, so overlap is impossible by construction rather than by
 * hand-tuned offsets. From 901px the same images become an absolutely
 * positioned perimeter around the copy, where there is room for all eleven.
 */
/**
 * One scattered composition. Each athlete is absolutely positioned inside the
 * hero by its own class, tuned per breakpoint so the figures sit in the free
 * margins around the copy — the side gutters included, which a row layout
 * wasted entirely.
 */
const HERO_ATHLETES = [
  { id: 'football', src: '/images/sports/football.webp' },
  { id: 'handball', src: '/images/sports/handball.png' },
  { id: 'volleyball', src: '/images/sports/volleyball.png' },
  { id: 'basketball', src: '/images/sports/basketball.webp' },
  { id: 'cricket', src: '/images/sports/cricket.webp' },
  { id: 'badminton', src: '/images/sports/badminton.webp' },
  { id: 'chess', src: '/images/sports/chess.webp' },
  { id: 'tennis', src: '/images/sports/tennis.webp' },
  { id: 'kabaddi', src: '/images/sports/kabaddi.webp' },
  { id: 'carrom', src: '/images/sports/carroms.webp' },
  { id: 'throwball', src: '/images/sports/throwball.webp' },
  { id: 'table-tennis', src: '/images/sports/tabletennis.webp' },

  // Echo figures fill out the composition with smaller repeats placed far from
  // their twin and never beside another figure of the same sport.
  // They are display:none by default and only appear where there is room.
  { id: 'echo-football', src: '/images/sports/football.webp', echo: true },
  { id: 'echo-badminton', src: '/images/sports/badminton.webp', echo: true },
  { id: 'echo-cricket', src: '/images/sports/cricket.webp', echo: true },
  { id: 'echo-chess', src: '/images/sports/chess.webp', echo: true },
  { id: 'echo-basketball', src: '/images/sports/basketball.webp', echo: true },
]

function Athlete({ sport }) {
  return (
    <img
      className={`hero-sport hero-sport--${sport.id}${sport.echo ? ' hero-sport--echo' : ''}`}
      src={sport.src}
      alt=""
      loading={sport.echo ? 'lazy' : 'eager'}
      decoding="async"
      fetchPriority="low"
    />
  )
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getVisibleLines(typedLength) {
  let consumed = 0

  return HERO_TAGLINE_LINES.map((line, index) => {
    const start = consumed
    // Every line but the last is followed by the space that joins the tagline.
    consumed += line.length + (index < HERO_TAGLINE_LINES.length - 1 ? 1 : 0)
    return line.slice(0, Math.max(0, typedLength - start))
  })
}

function HeroTagline() {
  const [typedLength, setTypedLength] = useState(() => (prefersReducedMotion() ? HERO_TAGLINE.length : 0))
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    let currentLength = 0
    let timerId

    const typeNextCharacter = () => {
      currentLength += 1
      setTypedLength(currentLength)

      if (currentLength < HERO_TAGLINE.length) {
        timerId = window.setTimeout(typeNextCharacter, TYPE_SPEED_MS)
        return
      }

      setShowCursor(true)
      timerId = window.setTimeout(() => setShowCursor(false), CURSOR_DURATION_MS)
    }

    timerId = window.setTimeout(typeNextCharacter, TYPE_SPEED_MS)
    return () => window.clearTimeout(timerId)
  }, [])

  const [visibleFirstLine, visibleSecondLine, visibleThirdLine] = getVisibleLines(typedLength)

  return (
    <h1 id="hero-title" aria-label={HERO_TAGLINE}>
      <span aria-hidden="true">
        {visibleFirstLine}<br />
        <em>
          {visibleSecondLine}
          {visibleThirdLine && <><span className="mobile-break"><br /></span> {visibleThirdLine}</>}
          {showCursor && <span className="hero-title-cursor" aria-hidden="true" />}
        </em>
      </span>
    </h1>
  )
}

export default function HeroSection({ hasLive = false }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-athletes" aria-hidden="true">
        {HERO_ATHLETES.map((sport) => <Athlete sport={sport} key={sport.id} />)}
      </div>

      <div className="hero-content">
        {/* SASTRA leads the lockup; FUERA sits beneath it as the event mark. */}
        <p className="hero-sastra">
          <img
            src={SASTRA_LOGO_SRC}
            alt="SASTRA Deemed University"
            width="400"
            height="107"
            fetchPriority="high"
            decoding="async"
          />
        </p>

        <img
          className="hero-wordmark"
          src="/images/fuera26-27.webp"
          alt="FUERA 26–27"
          width="900"
          height="156"
          decoding="async"
        />

        <p className="hero-fest-label">{HERO_FEST_LABEL}</p>
        <HeroTagline />

        <div className="hero-actions">
          <a className="button button-primary" href="#sports">
            <span>Explore sports</span>
            <ArrowIcon />
          </a>
          <a className="button button-ghost" href="/fixtures">
            <span>{hasLive ? 'Live scores' : 'View fixtures'}</span>
            {hasLive && <span className="button__live-dot" aria-hidden="true" />}
          </a>
        </div>
      </div>

    </section>
  )
}
