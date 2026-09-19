// FeaturedSports.jsx

import { useEffect, useState } from 'react'
import SportsImage from '../common/SportsImage'
import ScrollReveal from '../common/ScrollReveal'
import { apiRequest, getApiErrorMessage } from '../../services/api'
import { getSportContacts } from '../../data/sportContacts'
import { sportGender } from '../../data/sportGender'
import { getPublicSportName, getSportRules } from '../../data/sportRules'

function SportArtwork({ sport, displayName }) {
  if (!sport.imageUrl) {
    return (
      <div
        className="sport-card__placeholder"
        role="img"
        aria-label={`${displayName} image coming soon`}
      >
        <span>{displayName}</span>
      </div>
    )
  }

  return (
    <SportsImage
      src={sport.imageUrl}
      alt={displayName}
      className="event-image"
    />
  )
}

function SportRulesModal({ sport, onClose }) {
  const [hasAcknowledged, setHasAcknowledged] = useState(false)
  const rules = getSportRules(sport.name)
  const displayName = getPublicSportName(sport.name)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleContinue = () => {
    if (!hasAcknowledged || !sport.formUrl) return
    window.location.assign(sport.formUrl)
  }

  return (
    <div
      className="sport-rules-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="sport-rules-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sport-rules-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sport-rules-modal__header">
          <div>
            <span className="sport-rules-modal__eyebrow">FUERA 26–27 / Rules</span>
            <h2 id="sport-rules-title">{displayName}</h2>
          </div>
          <button
            className="sport-rules-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Close sport rules"
          >
            ×
          </button>
        </div>

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
          <p className="sport-rules-modal__unavailable">
            Rules for this sport will be published soon.
          </p>
        )}

        <p className="sport-rules-modal__eligibility">
          Open to all UG, PG, &amp; PhD scholars.
        </p>

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
      </section>
    </div>
  )
}

function SportInCharge({ sportName }) {
  const contacts = getSportContacts(sportName)

  if (!contacts || !contacts.captains.length) {
    return null
  }

  return (
    <div className="sport-in-charge">
      {contacts.captains.map((person) => (
        <div
          className="sport-in-charge__person"
          key={person.name}
        >
          <span>{person.name}</span>

          <a
            href={`tel:${person.contact}`}
            onClick={(event) => event.stopPropagation()}
          >
            {person.contact}
          </a>
        </div>
      ))}
    </div>
  )
}

export default function FeaturedSports() {
  const [sports, setSports] = useState([])
  const [selectedSport, setSelectedSport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    apiRequest('/api/sports', { auth: false })
      .then((data) => {
        if (active) setSports(data?.sports || [])
      })
      .catch((requestError) => {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              'Unable to load sports. Please try again.'
            )
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <section
        className="events section-wrap"
        id="sports"
        aria-labelledby="sports-heading"
      >
      <div className="events-heading-row">
        <div>
          <ScrollReveal as="h2" id="sports-heading">
            Find your <em>sport.</em>
          </ScrollReveal>
        </div>
      </div>

      {loading ? (
        <p className="sports-feedback" role="status">
          Loading sports…
        </p>
      ) : error ? (
        <p className="sports-feedback" role="alert">
          {error}
        </p>
      ) : sports.length === 0 ? (
        <p className="sports-feedback" role="status">
          Sports will appear here once they are configured.
        </p>
      ) : (
        <div className="events-grid">
          {sports.map((sport, index) => {
            const displayName = getPublicSportName(sport.name)
            const genderKey = sport.name.replace(/\s+/g, '')
            const gender =
              sportGender[sport.name] ||
              sportGender[genderKey]

            return (
              <article
                className="event-card event-card--interactive"
                key={sport._id}
                role="button"
                tabIndex="0"
                aria-label={`View ${displayName} rules`}
                onClick={() => setSelectedSport(sport)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedSport(sport)
                  }
                }}
              >
                <div className="event-image-wrap">
                  <SportArtwork sport={sport} displayName={displayName} />

                  <span className="event-tag">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="event-copy">
                  <div className="sport-card__title">
                    <h3>{displayName}</h3>

                    {gender && (
                      <span className="sport-card__gender">
                        {gender}
                      </span>
                    )}
                  </div>

                  <SportInCharge
                    sportName={sport.name}
                  />
                </div>
              </article>
            )
          })}
        </div>
      )}
      </section>

      {selectedSport && (
        <SportRulesModal
          sport={selectedSport}
          onClose={() => setSelectedSport(null)}
        />
      )}
    </>
  )
}
