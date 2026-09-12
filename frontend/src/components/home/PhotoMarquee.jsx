import { useState } from 'react'

function ArchiveImage({ item, hidden = false }) {
  const [failed, setFailed] = useState(false)
  const alt = item.title || item.year ? [item.title, item.year].filter(Boolean).join(' / ') : 'Previous FUERA edition photograph'

  if (failed) return <div className="photo-marquee__image-fallback" aria-hidden={hidden}>Image unavailable</div>
  return <img src={item.imageUrl} alt={hidden ? '' : alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
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

export default function PhotoMarquee({ items }) {
  return (
    <div className="photo-marquee" aria-label="FUERA archive photographs">
      <div className="photo-marquee__track">
        <PhotoGroup items={items} />
        <PhotoGroup items={items} hidden />
      </div>
    </div>
  )
}
