import { useEffect, useState } from 'react'
import ArrowIcon from '../common/ArrowIcon'
import SportsImage from '../common/SportsImage'
import { apiRequest, getApiErrorMessage } from '../../services/api'
import { getSportContacts } from '../../data/sportContacts'
import { sportGender } from '../../data/sportGender'

function SportArtwork({ sport }) {
  if (!sport.imageUrl) {
    return <div className="sport-card__placeholder" role="img" aria-label={`${sport.name} image coming soon`}><span>{sport.name}</span></div>
  }

  return <SportsImage src={sport.imageUrl} alt={sport.name} className="event-image" />
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

          <a href={`tel:${person.contact}`}>
            {person.contact}
          </a>
        </div>
      ))}
    </div>
  )
}

export default function FeaturedSports() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/api/sports', { auth: false })
      .then((data) => { if (active) setSports(data?.sports || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load sports. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [])

  return (
    <section className="events section-wrap" id="sports" aria-labelledby="sports-heading">
      <div className="events-heading-row">
        <div>
          <h2 id="sports-heading">Find your <em>sport.</em></h2>
        </div>
      </div>
      {loading ? <p className="sports-feedback" role="status">Loading sports…</p> : error ? (
        <p className="sports-feedback" role="alert">{error}</p>
      ) : sports.length === 0 ? (
        <p className="sports-feedback" role="status">Sports will appear here once they are configured.</p>
      ) : (
        <div className="events-grid">
          {sports.map((sport, index) => {
            const canRegister = sport.isActive && sport.formUrl
            const registrationLinkProps = {
              href: sport.formUrl,
              target: '_blank',
              rel: 'noopener noreferrer',
            }
            return (
  <article className="event-card" key={sport._id}>
    <div className="event-image-wrap">
      {canRegister ? (
        <a className="sport-card__image-link" {...registrationLinkProps}>
          <SportArtwork sport={sport} />
        </a>
      ) : (
        <SportArtwork sport={sport} />
      )}
      <span className="event-tag">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>

    <div className="event-copy">
      <div className="sport-card__title">
        <h3>
          {canRegister ? (
            <a className="sport-card__name-link" {...registrationLinkProps}>
              {sport.name}
            </a>
          ) : (
            sport.name
          )}
        </h3>

        {sportGender[sport.name] && (
          <span className="sport-card__gender">
            {sportGender[sport.name]}
          </span>
        )}
      </div>

      {canRegister ? (
        <a className="sport-card__register" {...registrationLinkProps}>
          Register now <ArrowIcon />
        </a>
      ) : (
        <span
          className="sport-card__register is-disabled"
          role="status"
          aria-label={`${sport.name} registration ${
            sport.isActive ? 'form coming soon' : 'closed'
          }`}
        >
          {sport.isActive ? 'FORM COMING SOON' : 'Registration closed'}
        </span>
      )}

      <SportInCharge sportName={sport.name} />
    </div>
  </article>
    )
          })}
        </div>
      )}
    </section>
  )
}
