import { useCallback, useEffect, useRef, useState } from 'react'
import WinnerCard from './WinnerCard'

export default function WinnersSlider({ items = [] }) {
  const sliderRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const checkScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8)

    const cards = el.querySelectorAll('.winners-slider__item')
    if (cards.length > 0) {
      const cardWidth = cards[0].offsetWidth + 16
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(Math.max(0, index), items.length - 1))
    }
  }, [items.length])

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction) => {
    const el = sliderRef.current
    if (!el) return
    const card = el.querySelector('.winners-slider__item')
    const scrollAmount = card ? card.offsetWidth + 20 : 340
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const scrollToIndex = (index) => {
    const el = sliderRef.current
    if (!el) return
    const card = el.querySelectorAll('.winners-slider__item')[index]
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }
  }

  // Desktop mouse drag-to-scroll handlers
  const handleMouseDown = (e) => {
    const el = sliderRef.current
    if (!el) return
    isDraggingRef.current = true
    startXRef.current = e.pageX - el.offsetLeft
    scrollLeftRef.current = el.scrollLeft
    el.classList.add('is-grabbing')
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    const el = sliderRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startXRef.current) * 1.4
    el.scrollLeft = scrollLeftRef.current - walk
  }

  const stopDragging = () => {
    isDraggingRef.current = false
    const el = sliderRef.current
    if (el) el.classList.remove('is-grabbing')
  }

  if (!items.length) return null

  return (
    <div className="winners-slider-wrapper">
      <div className="winners-slider-controls">
        <span className="winners-slider-hint">
          Swipe or drag to explore cards ({items.length} games)
        </span>
        <div className="winners-nav-buttons">
          <button
            type="button"
            className="winners-nav-btn"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous card"
          >
            ←
          </button>
          <button
            type="button"
            className="winners-nav-btn"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next card"
          >
            →
          </button>
        </div>
      </div>

      <div
        className="winners-slider"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        role="region"
        aria-label="Winners cards slider"
        tabIndex={0}
      >
        {items.map((winner) => (
          <div className="winners-slider__item" key={winner.id}>
            <WinnerCard winner={winner} />
          </div>
        ))}
      </div>

      <div className="winners-slider-dots" role="tablist" aria-label="Card pagination">
        {items.map((winner, index) => (
          <button
            key={winner.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            className={`winners-slider-dot ${activeIndex === index ? 'is-active' : ''}`.trim()}
            onClick={() => scrollToIndex(index)}
            aria-label={`Jump to ${winner.title}`}
          />
        ))}
      </div>
    </div>
  )
}
