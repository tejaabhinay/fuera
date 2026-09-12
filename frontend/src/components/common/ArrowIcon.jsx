export default function ArrowIcon({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className={`arrow-icon ${className}`.trim()}>
      <path d="M2 9h13M10 3l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
