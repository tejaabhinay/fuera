import { useState } from 'react'

function dateValue(value) {
  return value ? String(value).slice(0, 10) : ''
}

function toFormValue(event) {
  return {
    title: event?.title || '',
    date: dateValue(event?.date),
  }
}

export default function TimelineForm({ initialEvent, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(() => toFormValue(initialEvent))
  const [error, setError] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.date) {
      setError('Title and date are required.')
      return
    }

    setError('')
    onSubmit({
      title: form.title.trim(),
      date: form.date,
    })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section className="admin-form-modal" role="dialog" aria-modal="true" aria-labelledby="timeline-form-title">
        <div className="admin-modal-heading">
          <div>
            <span className="admin-eyebrow">Homepage timeline</span>
            <h2 id="timeline-form-title">{initialEvent ? 'Edit event' : 'Add event'}</h2>
          </div>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label="Close timeline form">×</button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-form-grid__wide">Title *<input name="title" value={form.title} onChange={updateField} required /></label>
            <label>Date *<input name="date" type="date" value={form.date} onChange={updateField} required /></label>
          </div>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <div className="admin-form-actions">
            <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save event'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
