import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        // The reveal is a one-way entrance animation. Re-hiding on exit made it replay —
        // and re-render — every time the heading scrolled past.
        setIsVisible(true)
        observer.disconnect()
      },
      { threshold: 0.1 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
