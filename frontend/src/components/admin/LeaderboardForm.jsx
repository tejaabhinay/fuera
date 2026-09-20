import { useState } from 'react'
import { useDialog } from '../../hooks/useDialog'

function toFormValue(entry) {
  return {
    department: entry?.department || '',
    gold: entry?.gold ?? 0,
    silver: entry?.silver ?? 0,
    bronze: entry?.bronze ?? 0,
    order: entry?.order ?? 0,
    isPublished: entry?.isPublished ?? true,
  }
}

export default function LeaderboardForm({ initialEntry, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(() => toFormValue(initialEntry))
  const [error, setError] = useState('')
  const dialogRef = useDialog(onCancel)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const department = form.department.trim()
    const medals = ['gold', 'silver', 'bronze'].map((key) => Number(form[key]))
    const order = Number(form.order)

    if (!department) return setError('Department name is required.')
    if (medals.some((value) => !Number.isFinite(value) || value < 0)) {
      return setError('Medal counts must be 0 or more.')
    }
    if (!Number.isFinite(order)) return setError('Tiebreak order must be a valid number.')

    setError('')
    return onSubmit({
      department,
      gold: medals[0],
      silver: medals[1],
      bronze: medals[2],
      order,
      isPublished: Boolean(form.isPublished),
    })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section
        className="admin-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaderboard-form-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="admin-modal-heading">
          <div>
            <span className="admin-eyebrow">Championship standings</span>
            <h2 id="leaderboard-form-title">{initialEntry ? 'Edit department' : 'Add department'}</h2>
          </div>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label="Close leaderboard form">×</button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label className="admin-form-grid__wide">
              Department *
              <input name="department" value={form.department} onChange={updateField} required />
            </label>
            <label>Gold<input name="gold" type="number" min="0" step="1" value={form.gold} onChange={updateField} /></label>
            <label>Silver<input name="silver" type="number" min="0" step="1" value={form.silver} onChange={updateField} /></label>
            <label>Bronze<input name="bronze" type="number" min="0" step="1" value={form.bronze} onChange={updateField} /></label>
            <label>Tiebreak order<input name="order" type="number" step="1" value={form.order} onChange={updateField} /></label>
            <label className="admin-checkbox">
              <input
                name="isPublished"
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
              />
              Show on the public standings
            </label>
          </div>

          {error && <p className="admin-form-error" role="alert">{error}</p>}

          <div className="admin-form-actions">
            <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save department'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
