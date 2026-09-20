import { useEffect, useState } from 'react'
import '../../admin.css'
import BrandLockup from '../../components/common/BrandLockup'
import { apiRequest, getApiErrorMessage, getAuthToken, setAuthToken } from '../../services/api'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [setupRequired, setSetupRequired] = useState(false)

  useEffect(() => {
    if (getAuthToken()) window.location.replace('/admin')
    apiRequest('/api/auth/setup-status', { auth: false })
      .then((data) => setSetupRequired(Boolean(data?.setupRequired)))
      .catch(() => setSetupRequired(false))
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { email: email.trim(), password },
      })
      setAuthToken(result.token)
      window.location.replace('/admin')
    } catch (requestError) {
      setError(requestError.status === 401 ? 'Invalid email or password.' : getApiErrorMessage(requestError, 'Unable to sign in right now.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <a className="admin-login-brand" href="/"><BrandLockup label="/ Admin" /></a>
        <span className="admin-eyebrow">Organizer access</span>
        <h1 id="admin-login-title">Welcome<br /><em>back.</em></h1>
        <p className="admin-login-copy">Sign in to manage fixtures and the public FUERA timeline.</p>
        <form className="admin-form admin-login-form" onSubmit={handleSubmit}>
          <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <button className="admin-button admin-button--primary admin-login-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        {setupRequired && <a className="admin-login-setup-link" href="/admin/signup">First-time setup →</a>}
        <a className="admin-back-link" href="/">Return to FUERA</a>
      </section>
    </main>
  )
}
