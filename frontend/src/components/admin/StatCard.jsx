export default function StatCard({ label, value, detail }) {
  return (
    <article className="admin-stat-card">
      <span className="admin-stat-card__label">{label}</span>
      <strong>{value}</strong>
      {detail && <span className="admin-stat-card__detail">{detail}</span>}
    </article>
  )
}
