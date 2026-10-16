import { Award, Medal, Trophy } from 'lucide-react'

const MEDAL_ICONS = {
  gold: Trophy,
  silver: Medal,
  bronze: Award,
}

export default function WinnerCard({ winner }) {
  return (
    <article className="winner-card">
      <div className="winner-card__media">
        {winner.image ? (
          <img
            src={winner.image}
            alt={winner.title}
            className="winner-card__image"
            loading="lazy"
          />
        ) : (
          <div className="winner-card__media-placeholder">
            <span>{winner.sport}</span>
          </div>
        )}
        <div className="winner-card__media-overlay" aria-hidden="true" />
        <div className="winner-card__tags">
          <span className="winner-card__sport-tag">{winner.sport}</span>
          {winner.subtitle && (
            <span className="winner-card__format-tag">{winner.subtitle}</span>
          )}
        </div>
      </div>

      <div className="winner-card__content">
        <header className="winner-card__header">
          <h3 className="winner-card__title">{winner.title}</h3>
          {winner.category && (
            <span className="winner-card__category">{winner.category}</span>
          )}
        </header>

        <div className="winner-card__podium" role="list">
          {winner.podium.map((step) => {
            const Icon = MEDAL_ICONS[step.medal] || Medal
            const nameList = step.names || (step.name ? [step.name] : [])

            return (
              <div
                key={step.place}
                className={`winner-row winner-row--${step.medal}`}
                role="listitem"
              >
                <div className="winner-row__badge">
                  <Icon size={16} className="winner-row__icon" aria-hidden="true" />
                  <span className="winner-row__label">{step.label}</span>
                </div>
                <div className="winner-row__info">
                  {nameList.map((singleName, idx) => (
                    <div key={singleName} className="winner-row__name-line">
                      {idx > 0 && <span className="winner-row__amp">&amp;</span>}
                      <span className="winner-row__name">{singleName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <footer className="winner-card__footer">
          <span>FUERA 26–27 Official Result</span>
        </footer>
      </div>
    </article>
  )
}
