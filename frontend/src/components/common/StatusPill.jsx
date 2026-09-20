import { getStatusMeta } from '../../lib/fixtures'

/**
 * One status treatment used everywhere a match appears, so "live" reads the
 * same on a card, in the schedule and in the broadcast banner.
 */
export default function StatusPill({ status, size = 'md' }) {
  const { label, tone } = getStatusMeta(status)

  return (
    <span className={`status-pill status-pill--${tone} status-pill--${size}`}>
      {tone === 'live' && <span className="status-pill__pulse" aria-hidden="true" />}
      {label}
    </span>
  )
}
