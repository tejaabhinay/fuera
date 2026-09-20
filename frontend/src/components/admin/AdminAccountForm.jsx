import { useState } from 'react'
import { useDialog } from '../../hooks/useDialog'

export default function AdminAccountForm({ onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const dialogRef = useDialog(onCancel)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.email.trim() || !form.password) return setError('Email and password are required.')
    if (form.password.length < 12) return setError('Password must be at least 12 characters long.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    setError('')
    onSubmit({ email: form.email.trim(), password: form.password, confirmPassword: form.confirmPassword })
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">  
      <section className="admin-form-modal admin-confirm" role="dialog" aria-modal="true" aria-labelledby="admin-account-form-title" ref={dialogRef} tabIndex={-1}>
        <div className="admin-modal-heading">
          <div><span className="admin-eyebrow">Organizer access</span><h2 id="admin-account-form-title">Add administrator</h2></div>
          <button className="admin-modal-close" type="button" onClick={onCancel} aria-label="Close administrator form">×</button>
        </div>
        <form className="admin-form admin-login-form" onSubmit={handleSubmit}>
          <label>Email<input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required /></label>
          <label>Password<input type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required /></label>
          <label>Confirm password<input type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} required /></label>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <div className="admin-form-actions">
            <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
            <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create administrator'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
