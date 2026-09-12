import { useEffect, useState } from 'react'
import ArrowIcon from '../common/ArrowIcon'

const HERO_TAGLINE = 'THE GAME STARTS HERE'
const TYPE_SPEED_MS = 75
const CURSOR_DURATION_MS = 1200

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
      <div className="hero-player hero-player-football" aria-hidden="true">
        <img src="/images/sports/soccer(1).png" alt="" loading="eager" decoding="async" />
      </div>
      <div className="hero-player hero-player-cricket" aria-hidden="true">
        <img src="/images/sports/cricket(1).png" alt="" loading="eager" decoding="async" />
      </div>
      <div className="hero-content">
        <img className="hero-wordmark" src="/images/fuera26-27.png" alt="FUERA" />
        <HeroTagline />
        <a className="button button-primary" href="#sports">Explore sports <ArrowIcon /></a>
      </div>
    </section>
  )
}
