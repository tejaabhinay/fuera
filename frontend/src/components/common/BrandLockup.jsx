export const FUERA_LOGO_SRC = '/images/fuera26-27.png'
export const SASTRA_LOGO_SRC = '/images/sastralogo.jpg'

export default function BrandLockup({ className = '', label = '' }) {
  return (
    <span className={`brand-lockup ${className}`.trim()}>
      <img className="brand-lockup__sastra" src={SASTRA_LOGO_SRC} alt="SASTRA" />
      <span className="brand-lockup__separator" aria-hidden="true" />
      <img className="brand-lockup__fuera" src={FUERA_LOGO_SRC} alt="FUERA" />
      
      
      {label && <span className="brand-lockup__label">{label}</span>}
    </span>
  )
}
