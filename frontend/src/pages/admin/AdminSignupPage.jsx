import { useEffect, useState } from 'react'
import '../../admin.css'
import BrandLockup from '../../components/common/BrandLockup'
import { apiRequest, getApiErrorMessage } from '../../services/api'

export default function AdminSignupPage() {
  const [setupRequired, setSetupRequired] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    apiRequest('/api/auth/setup-status', { auth: false })
      .then((data) => setSetupRequired(Boolean(data?.setupRequired)))
      .catch((requestError) => setError(requestError.status === 404 ? 'Admin setup service is unavailable. Please restart the backend.' : getApiErrorMessage(requestError, 'Unable to check admin setup status.')))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password || password !== confirmPassword) {
      setError(!email.trim() || !password ? 'Enter an email and password.' : 'Passwords do not match.')
      return
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters long.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await apiRequest('/api/auth/signup', { method: 'POST', auth: false, body: { email: email.trim(), password, confirmPassword } })
      setSuccess(true)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create the admin account.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card" aria-labelledby="admin-signup-title">
        <a className="admin-login-brand" href="/"><BrandLockup label="/ Admin" /></a>
        <span className="admin-eyebrow">First-time setup</span>
        {setupRequired === null ? <p className="admin-login-copy" role={error ? 'alert' : 'status'}>{error || 'Checking admin setup…'}</p> : setupRequired === false ? (
          <>
            <h1 id="admin-signup-title">Setup<br /><em>complete.</em></h1>
            <p className="admin-login-copy">Admin setup is already complete. Please log in with an existing account.</p>
            <a className="admin-button admin-button--primary admin-login-submit" href="/admin/login">Go to login</a>
          </>
        ) : success ? (
          <>
            <h1 id="admin-signup-title">Account<br /><em>ready.</em></h1>
            <p className="admin-login-copy">Your administrator account was created. Sign in to continue.</p>
            <a className="admin-button admin-button--primary admin-login-submit" href="/admin/login">Go to login</a>
          </>
        ) : (
          <>
            <h1 id="admin-signup-title">Create<br /><em>access.</em></h1>
            <p className="admin-login-copy">Create the first FUERA administrator account. This setup closes after the first account is created.</p>
            <form className="admin-form admin-login-form" onSubmit={handleSubmit}>
              <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label>Password<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
              <label>Confirm password<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required /></label>
              {error && <p className="admin-form-error" role="alert">{error}</p>}
              <button className="admin-button admin-button--primary admin-login-submit" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create admin account'}</button>
            </form>
          </>
        )}
        <a className="admin-back-link" href="/admin/login">Return to login</a>
      </section>
    </main>
  )
}
