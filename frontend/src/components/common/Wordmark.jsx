import { FUERA_LOGO_SRC } from './BrandLockup'

export default function Wordmark({ className = '' }) {
  return <img className={`wordmark ${className}`} src={FUERA_LOGO_SRC} alt="FUERA" />
}
