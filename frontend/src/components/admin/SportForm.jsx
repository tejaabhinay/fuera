import { useState } from 'react'
import { useDialog } from '../../hooks/useDialog'
import ImageUploadField from './ImageUploadField'

function toFormValue(sport) {
  return {
    name: sport?.name || '',
    formUrl: sport?.formUrl || '',
    imageUrl: sport?.imageUrl || '',
    isActive: sport?.isActive ?? true,
    order: sport?.order ?? 0,
  }
}

function isHttpUrl(value) {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function SportForm({ initialSport, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(() => toFormValue(initialSport))
  const [error, setError] = useState('')
  const dialogRef = useDialog(onCancel)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const formUrl = form.formUrl.trim()
    const order = Number(form.order)

    if (!name) {
      setError('Sport name is required.')
      return
    }
    if (!isHttpUrl(formUrl)) {
      setError('Google Form URL must be a valid HTTP or HTTPS URL.')
      return
    }
    if (!Number.isFinite(order)) {
      setError('Display order must be a valid number.')
      return
    }

    setError('')
    onSubmit({ name, formUrl, imageUrl: form.imageUrl, isActive: Boolean(form.isActive), order })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section className="admin-form-modal" role="dialog" aria-modal="true" aria-labelledby="sport-form-title" ref={dialogRef} tabIndex={-1}>
        <div className="admin-modal-heading">
          <div><span className="admin-eyebrow">Sport registration</span><h2 id="sport-form-title">{initialSport ? 'Edit sport' : 'Add sport'}</h2></div>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label="Close sport form">×</button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label>Sport Name *<input name="name" value={form.name} onChange={updateField} required /></label>
            <label className="admin-form-grid__wide">Google Form URL<input name="formUrl" type="url" value={form.formUrl} onChange={updateField} placeholder="Leave empty until configured" /></label>
            <div className="admin-form-grid__wide"><ImageUploadField label="Sport image" folder="sports" value={form.imageUrl} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} disabled={submitting} /></div>
            <label>Display Order<input name="order" type="number" step="1" value={form.order} onChange={updateField} /></label>
            <label className="admin-checkbox"><input name="isActive" type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} /> Active registration</label>
          </div>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <div className="admin-form-actions">
            <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save sport'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
