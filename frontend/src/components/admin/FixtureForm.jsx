import { useId, useState } from 'react'
import { useDialog } from '../../hooks/useDialog'
import { useApiResource } from '../../hooks/useApiResource'
import ImageUploadField from './ImageUploadField'

const statuses = ['upcoming', 'live', 'completed', 'postponed', 'cancelled']

function dateValue(value) {
  return value ? String(value).slice(0, 10) : ''
}

function toFormValue(fixture) {
  return {
    sport: fixture?.sport || '',
    round: fixture?.round || '',
    teamA: fixture?.teamA || '',
    teamB: fixture?.teamB || '',
    date: dateValue(fixture?.date),
    time: fixture?.time || '',
    venue: fixture?.venue || '',
    status: fixture?.status || 'upcoming',
    scoreA: fixture?.scoreA ?? '',
    scoreB: fixture?.scoreB ?? '',
    imageUrl: fixture?.imageUrl || '',
    notes: fixture?.notes || '',
  }
}

export default function FixtureForm({ initialFixture, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(() => toFormValue(initialFixture))
  const [error, setError] = useState('')
  const dialogRef = useDialog(onCancel)
  const sportListId = useId()
  // Free-text sport names drift from the Sport records ("Carroms" vs "carrom"),
  // which silently breaks the per-sport stats on the homepage. Suggesting the
  // configured names keeps them aligned without rejecting existing values.
  const { data: sportData } = useApiResource('/api/sports/admin', { auth: true, errorMessage: '' })
  const sportNames = (sportData?.sports || []).map((sport) => sport.name)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.sport.trim() || !form.date) {
      setError('Sport and date are required.')
      return
    }

    const scoreA = form.scoreA === '' ? null : Number(form.scoreA)
    const scoreB = form.scoreB === '' ? null : Number(form.scoreB)
    if ((form.scoreA !== '' && !Number.isFinite(scoreA)) || (form.scoreB !== '' && !Number.isFinite(scoreB))) {
      setError('Scores must be valid numbers when supplied.')
      return
    }

    setError('')
    onSubmit({
      sport: form.sport.trim(),
      round: form.round.trim(),
      teamA: form.teamA.trim(),
      teamB: form.teamB.trim(),
      date: form.date,
      time: form.time.trim(),
      venue: form.venue.trim(),
      status: form.status,
      scoreA,
      scoreB,
      imageUrl: form.imageUrl.trim(),
      notes: form.notes.trim(),
    })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section className="admin-form-modal" role="dialog" aria-modal="true" aria-labelledby="fixture-form-title" ref={dialogRef} tabIndex={-1}>
        <div className="admin-modal-heading">
          <div>
            <span className="admin-eyebrow">Fixture content</span>
            <h2 id="fixture-form-title">{initialFixture ? 'Edit fixture' : 'Add fixture'}</h2>
          </div>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label="Close fixture form">×</button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label>
              Sport *
              <input name="sport" value={form.sport} onChange={updateField} list={sportListId} required />
              <datalist id={sportListId}>
                {sportNames.map((name) => <option value={name} key={name} />)}
              </datalist>
            </label>
            <label>Round<input name="round" value={form.round} onChange={updateField} placeholder="Quarter Final" /></label>
            <label>Team A<input name="teamA" value={form.teamA} onChange={updateField} /></label>
            <label>Team B<input name="teamB" value={form.teamB} onChange={updateField} /></label>
            <label>Date *<input name="date" type="date" value={form.date} onChange={updateField} required /></label>
            <label>Time<input name="time" value={form.time} onChange={updateField} placeholder="To be confirmed" /></label>
            <label>Venue<input name="venue" value={form.venue} onChange={updateField} /></label>
            <label>Status<select name="status" value={form.status} onChange={updateField}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
            <label>Score A<input name="scoreA" type="number" min="0" step="1" value={form.scoreA} onChange={updateField} /></label>
            <label>Score B<input name="scoreB" type="number" min="0" step="1" value={form.scoreB} onChange={updateField} /></label>
            <div className="admin-form-grid__wide"><ImageUploadField label="Fixture image" folder="fixtures" value={form.imageUrl} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} disabled={submitting} /></div>
            <label className="admin-form-grid__wide">Notes<textarea name="notes" rows="3" value={form.notes} onChange={updateField} /></label>
          </div>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <div className="admin-form-actions">
            <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save fixture'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
