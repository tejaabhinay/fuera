// TimelineSection.jsx

import { useEffect, useState } from 'react'
import ScrollReveal from '../common/ScrollReveal'
import { apiRequest, getApiErrorMessage } from '../../services/api'

function formatDate(value) {
  if (!value) return 'Date TBC'

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default function TimelineSection() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    apiRequest('/api/timeline', { auth: false })
      .then((data) => {
        if (active) setEvents(data?.events || [])
      })
      .catch((requestError) => {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              'Unable to load the event timeline.'
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
    <section
      className="timeline-section section-wrap"
      id="timeline"
      aria-labelledby="timeline-title"
    >
      <div className="timeline-heading">
        <div>
          <ScrollReveal as="h2" id="timeline-title">
            Keep the
            <br />
            <em>story moving.</em>
          </ScrollReveal>
        </div>
      </div>

      {loading ? (
        <p className="timeline-empty" role="status">
          Loading timeline…
        </p>
      ) : error ? (
        <p className="timeline-empty" role="alert">
          {error}
        </p>
      ) : events.length === 0 ? (
        <p className="timeline-empty" role="status">
          Dates will appear here once they are added.
        </p>
      ) : (
        <ol className="timeline-list">
          {events.map((event, index) => (
            <li
              className="timeline-item"
              key={event._id || `${event.title}-${index}`}
            >
              <span className="timeline-item__number">
                /{String(index + 1).padStart(2, '0')}
              </span>

              <div className="timeline-item__content">
                <div className="timeline-item__meta">
                  <span>{formatDate(event.date)}</span>
                </div>

                <h3>{event.title}</h3>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}