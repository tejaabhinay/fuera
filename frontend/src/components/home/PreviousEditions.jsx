// PreviousEditions.jsx

import { useEffect, useState } from 'react'
import PhotoMarquee from './PhotoMarquee'
import ScrollReveal from '../common/ScrollReveal'
import { apiRequest, getApiErrorMessage } from '../../services/api'

export default function PreviousEditions() {
  const [archives, setArchives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    apiRequest('/api/previous-editions', { auth: false })
      .then((data) => {
        if (active) {
          setArchives(
            Array.isArray(data)
              ? data
              : data?.previousEditions || []
          )
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              'Unable to load archive photographs.'
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
      className="previous-editions section-wrap"
      id="archive"
      aria-labelledby="archive-heading"
    >
      <div className="previous-editions__header">
        <div>
          <ScrollReveal as="h2" id="archive-heading">
            From the
            <br />
            <em>archive.</em>
          </ScrollReveal>
        </div>
      </div>

      {loading ? (
        <p className="previous-editions__note" role="status">
          Loading archive photographs…
        </p>
      ) : error ? (
        <p className="previous-editions__note" role="alert">
          {error}
        </p>
      ) : archives.length > 0 ? (
        <PhotoMarquee items={archives} />
      ) : (
        <p className="previous-editions__note" role="status">
          Previous edition photographs will appear here once they are added.
        </p>
      )}
    </section>
  )
}