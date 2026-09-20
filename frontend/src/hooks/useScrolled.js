import { useEffect, useState } from 'react'

/**
 * True once the page has scrolled past `threshold`. Uses a passive listener and
 * only sets state on an actual transition, so scrolling does not re-render.
 */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => {
      setScrolled((current) => {
        const next = window.scrollY > threshold
        return next === current ? current : next
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold])

  return scrolled
}
