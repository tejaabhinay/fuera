import { useEffect, useState } from 'react'
import AdminAccountForm from '../../components/admin/AdminAccountForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { apiRequest, getApiErrorMessage } from '../../services/api'

function formatDate(value) {
  if (!value) return 'Date unavailable'
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    apiRequest('/api/admins')
      .then((data) => { if (active) setAdmins(data?.admins || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load administrators. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  const handleCreate = async (payload) => {
    setSubmitting(true)
    try {
      await apiRequest('/api/admins', { method: 'POST', body: payload })
      setShowForm(false)
      setNotice('Administrator created successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to create administrator. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiRequest(`/api/admins/${deleteTarget.id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      setNotice('Administrator removed successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to remove administrator. Please try again.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header--compact">
        <div><span className="admin-eyebrow">Access / Organizers</span><h1>People<br /><em>in charge.</em></h1></div>
        <button className="admin-button admin-button--primary" type="button" onClick={() => { setError(''); setShowForm(true) }}>+ Add administrator</button>
      </header>
      {notice && <div className="admin-alert admin-alert--success" role="status">{notice}</div>}
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <section className="admin-table-card" aria-labelledby="admin-list-title">
        <div className="admin-table-heading"><div><span className="admin-eyebrow">Shared administrator permissions</span><h2 id="admin-list-title">Administrators</h2></div><span className="admin-count">{loading ? 'Loading…' : `${admins.length} total`}</span></div>
        {loading ? <p className="admin-empty">Loading administrators…</p> : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead><tr><th>Email</th><th>Added</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="admin-table__strong">{admin.email}</td>
                  <td>{formatDate(admin.createdAt)}</td>
                  <td><div className="admin-row-actions"><button className="is-danger" type="button" onClick={() => setDeleteTarget(admin)}>Remove</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
      {showForm && <AdminAccountForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitting={submitting} />}
      <ConfirmDialog open={Boolean(deleteTarget)} title="Remove this administrator?" message="The account will no longer be able to access the FUERA admin dashboard." onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} confirming={deleting} />
    </div>
  )
}
