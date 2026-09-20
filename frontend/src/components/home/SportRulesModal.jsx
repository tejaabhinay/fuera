import { useState } from 'react'
import { X } from 'lucide-react'
import { useDialog } from '../../hooks/useDialog'
import { getPublicSportName, getSportRules } from '../../data/sportRules'

/**
 * The registration gate. Extracted from FeaturedSports so the card grid and the
 * dialog can change independently.
 */
export default function SportRulesModal({ sport, onClose }) {
  const [hasAcknowledged, setHasAcknowledged] = useState(false)
  const dialogRef = useDialog(onClose)
  const rules = getSportRules(sport.name)
  const displayName = getPublicSportName(sport.name)

  const handleContinue = () => {
    if (!hasAcknowledged || !sport.formUrl) return
    window.location.assign(sport.formUrl)
  }

  return (
    <div className="sport-rules-backdrop" role="presentation" onClick={onClose}>
      <section
        className="sport-rules-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sport-rules-title"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sport-rules-modal__header">
          <div>
            <span className="sport-rules-modal__eyebrow">FUERA 26–27 / Rules</span>
            <h2 id="sport-rules-title">{displayName}</h2>
          </div>
          <button className="sport-rules-modal__close" type="button" onClick={onClose} aria-label="Close sport rules">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="sport-rules-modal__body">
          {rules ? (
            <>
              <h3>Rules</h3>
              <ul className="sport-rules-modal__list">
                {rules.rules.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
              <p className="sport-rules-modal__fee">
                <span>Registration fee</span>
                <strong>{rules.fee}</strong>
              </p>
            </>
          ) : (
            <p className="sport-rules-modal__unavailable">Rules for this sport will be published soon.</p>
          )}

          <p className="sport-rules-modal__eligibility">Open to all UG, PG, &amp; PhD scholars.</p>
        </div>

        <div className="sport-rules-modal__actions">
          <label className="sport-rules-modal__agreement">
            <input
              type="checkbox"
              checked={hasAcknowledged}
              onChange={(event) => setHasAcknowledged(event.target.checked)}
            />
            <span>I have read and understood the rules.</span>
          </label>

          <button
            className="button button-primary sport-rules-modal__continue"
            type="button"
            disabled={!hasAcknowledged || !sport.formUrl}
            onClick={handleContinue}
          >
            {sport.formUrl ? 'Continue to registration' : 'Form unavailable'}
          </button>
        </div>
      </section>
    </div>
  )
}
