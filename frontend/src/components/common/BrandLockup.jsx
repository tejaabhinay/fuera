export const FUERA_LOGO_SRC = '/images/fuera26-27.webp'
export const SASTRA_LOGO_SRC = '/images/sastralogo.png'

/**
 * `showFuera` is off in the site header, where the FUERA wordmark is redundant
 * against the hero. The footer and the admin shell still show the full lockup.
 */
export default function BrandLockup({ className = '', label = '', showFuera = true }) {
  return (
    <span className={`brand-lockup ${className}`.trim()}>
      <img className="brand-lockup__sastra" src={SASTRA_LOGO_SRC} alt="SASTRA" width="600" height="107" decoding="async" />

      {showFuera && (
        <>
          <span className="brand-lockup__separator" aria-hidden="true" />
          <img className="brand-lockup__fuera" src={FUERA_LOGO_SRC} alt="FUERA" width="900" height="156" decoding="async" />
        </>
      )}

      {label && <span className="brand-lockup__label">{label}</span>}
    </span>
  )
}
