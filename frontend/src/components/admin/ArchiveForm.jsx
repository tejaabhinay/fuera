import { useState } from 'react'
import ImageUploadField from './ImageUploadField'

function toFormValue(archive) {
  return {
    imageUrl: archive?.imageUrl || '',
    year: archive?.year || '',
    title: archive?.title || '',
    order: archive?.order ?? 0,
    isPublished: archive?.isPublished ?? true,
  }
}

export default function ArchiveForm({ initialArchive, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(() => toFormValue(initialArchive))
  const [error, setError] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const imageUrl = form.imageUrl.trim()
    const order = Number(form.order)

    if (!imageUrl) {
      setError('An archive image is required.')
      return
    }
    if (!Number.isFinite(order)) {
      setError('Display order must be a valid number.')
      return
    }

    setError('')
    onSubmit({
      imageUrl,
      year: form.year.trim(),
      title: form.title.trim(),
      order,
      isPublished: Boolean(form.isPublished),
    })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section className="admin-form-modal" role="dialog" aria-modal="true" aria-labelledby="archive-form-title">
        <div className="admin-modal-heading">
          <div><span className="admin-eyebrow">Previous editions</span><h2 id="archive-form-title">{initialArchive ? 'Edit archive image' : 'Add archive image'}</h2></div>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label="Close archive form">×</button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-grid__wide"><ImageUploadField label="Archive image" folder="previous-editions" value={form.imageUrl} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} disabled={submitting} /></div>
            <label>Year<input name="year" value={form.year} onChange={updateField} placeholder="Optional" /></label>
            <label>Title<input name="title" value={form.title} onChange={updateField} placeholder="Optional" /></label>
            <label>Display Order<input name="order" type="number" step="1" value={form.order} onChange={updateField} /></label>
            <label className="admin-checkbox"><input name="isPublished" type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} /> Published</label>
          </div>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <div className="admin-form-actions">
            <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save image'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
