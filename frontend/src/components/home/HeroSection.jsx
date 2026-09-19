import { useEffect, useState } from 'react'
import ArrowIcon from '../common/ArrowIcon'

const HERO_TAGLINE = 'THE GAME STARTS HERE'
const HERO_FEST_LABEL = 'INTRA-UNIVERSITY SPORTS FEST'
const TYPE_SPEED_MS = 75
const CURSOR_DURATION_MS = 1200

const HERO_SPORTS = [
  { id: 'football', src: '/images/sports/soccer(1).png', className: 'hero-sport--football' },
  { id: 'cricket', src: '/images/sports/cricket(1).png', className: 'hero-sport--cricket' },
  { id: 'badminton', src: '/images/sports/badminton.png', className: 'hero-sport--badminton' },
  { id: 'basketball', src: '/images/sports/basketball.png', className: 'hero-sport--basketball' },
  { id: 'carrom', src: '/images/sports/carroms.png', className: 'hero-sport--carrom hero-sport--light' },
  { id: 'chess', src: '/images/sports/chess.png', className: 'hero-sport--chess hero-sport--light' },
  { id: 'handball', src: '/images/sports/handball.png', className: 'hero-sport--handball' },
  { id: 'kabaddi', src: '/images/sports/kabaddi.png', className: 'hero-sport--kabaddi' },
  { id: 'table-tennis', src: '/images/sports/tabletennis.png', className: 'hero-sport--table-tennis hero-sport--light' },
  { id: 'tennis', src: '/images/sports/tennis.png', className: 'hero-sport--tennis' },
  { id: 'throwball', src: '/images/sports/throwball.png', className: 'hero-sport--throwball hero-sport--light' },
]

function HeroTagline() {
  const [typedLength, setTypedLength] = useState(() => (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? HERO_TAGLINE.length : 0
  ))
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

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

  const firstLine = HERO_TAGLINE.slice(0, 8)
  const secondLine = HERO_TAGLINE.slice(9, 15)
  const thirdLine = HERO_TAGLINE.slice(16, 20)
  const visibleFirstLine = firstLine.slice(0, typedLength)
  const visibleSecondLine = typedLength > 9 ? secondLine.slice(0, typedLength - 9) : ''
  const visibleThirdLine = typedLength > 16 ? thirdLine.slice(0, typedLength - 16) : ''

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

export default function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-sports" aria-hidden="true">
        {HERO_SPORTS.map((sport) => (
          <img
            className={`hero-sport ${sport.className}`}
            src={sport.src}
            alt=""
            loading="eager"
            decoding="async"
            key={sport.id}
          />
        ))}
      </div>
      <div className="hero-content">
        <img className="hero-wordmark" src="/images/fuera26-27.png" alt="FUERA" />
        <p className="hero-fest-label">{HERO_FEST_LABEL}</p>
        <HeroTagline />
        <a className="button button-primary" href="#sports">Explore sports <ArrowIcon /></a>
      </div>
    </section>
  )
}
