import { useRef, useState } from 'react'

function ArchiveImage({ item, hidden = false }) {
  const [failed, setFailed] = useState(false)
  const alt = item.title || item.year ? [item.title, item.year].filter(Boolean).join(' / ') : 'Previous FUERA edition photograph'

  if (failed) return <div className="photo-marquee__image-fallback" aria-hidden={hidden}>Image unavailable</div>
  return <img src={item.imageUrl} alt={hidden ? '' : alt} loading="lazy" decoding="async" draggable="false" onError={() => setFailed(true)} />
}

function PhotoGroup({ items, hidden = false }) {
  return (
    <div className="photo-marquee__group" aria-hidden={hidden}>
      {items.map((item) => (
        <figure className="photo-marquee__item" key={`${hidden ? 'duplicate-' : ''}${item._id}`}>
          <div className="photo-marquee__image-wrap">
            <ArchiveImage item={item} hidden={hidden} />
          </div>
        </figure>
      ))}
    </div>
  )
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getTranslateX(transform) {
  if (!transform || transform === 'none') return 0

  const values = transform
    .slice(transform.indexOf('(') + 1, -1)
    .split(',')
    .map(Number)

  return transform.startsWith('matrix3d') ? values[12] || 0 : values[4] || 0
}

export default function PhotoMarquee({ items }) {
  const trackRef = useRef(null)
  const dragRef = useRef(null)

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const track = trackRef.current
    if (!track) return

    const currentOffset = getTranslateX(window.getComputedStyle(track).transform)

    track.classList.add('is-dragging')
    track.style.animation = 'none'
    track.style.transform = `translate3d(${currentOffset}px, 0, 0)`
    track.setPointerCapture(event.pointerId)

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      currentOffset,
    }
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track || drag.pointerId !== event.pointerId) return

    const offset = drag.currentOffset + event.clientX - drag.startX
    track.style.transform = `translate3d(${offset}px, 0, 0)`
  }

  const finishDrag = (event) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track) return
    if (event && drag.pointerId !== event.pointerId) return

    const draggedOffset = drag.currentOffset + (event?.clientX || drag.startX) - drag.startX

    // The track renders the same group twice, so shifting by exactly one group width is
    // visually identical. Wrapping into that range stops repeated drags from accumulating
    // and eventually walking the whole strip off-screen.
    const groupWidth = track.scrollWidth / 2
    const finalOffset = groupWidth > 0 ? draggedOffset % groupWidth : draggedOffset

    track.classList.remove('is-dragging')
    dragRef.current = null

    if (prefersReducedMotion()) {
      // The CSS animation is disabled for these users, so dragging is the only way to
      // move the strip; keep the position they dragged to instead of snapping back.
      track.style.transform = `translate3d(${finalOffset}px, 0, 0)`
      return
    }

    track.style.setProperty('--marquee-offset', `${finalOffset}px`)
    track.style.transform = ''

    // Force a reflow so the restarted animation picks up the new offset.
    void track.offsetWidth
    track.style.animation = ''
  }

  return (
    <div
      className="photo-marquee"
      aria-label="FUERA archive photographs"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onLostPointerCapture={finishDrag}
    >
      <div className="photo-marquee__track" ref={trackRef}>
        <PhotoGroup items={items} />
        <PhotoGroup items={items} hidden />
      </div>
    </div>
  )
}
