import { useEffect, useState } from 'react'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import SportForm from '../../components/admin/SportForm'
import { apiRequest, getApiErrorMessage } from '../../services/api'

export default function AdminSportsPage() {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    apiRequest('/api/sports')
      .then((data) => { if (active) setSports(data?.sports || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load sports. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  const openCreate = () => { setNotice(''); setSelectedSport(null); setFormMode('create') }
  const openEdit = (sport) => { setNotice(''); setSelectedSport(sport); setFormMode('edit') }

  const handleSave = async (payload) => {
    setSubmitting(true)
    try {
      await apiRequest(selectedSport ? `/api/sports/${selectedSport._id}` : '/api/sports', { method: selectedSport ? 'PATCH' : 'POST', body: payload })
      setFormMode(null)
      setNotice(selectedSport ? 'Sport updated successfully.' : 'Sport created successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save sport. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiRequest(`/api/sports/${deleteTarget._id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      setNotice('Sport deleted successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete sport. Please try again.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header--compact">
        <div><span className="admin-eyebrow">Content / Registration</span><h1>Choose your<br /><em>arena.</em></h1></div>
        <button className="admin-button admin-button--primary" type="button" onClick={openCreate}>+ Add sport</button>
      </header>
      {notice && <div className="admin-alert admin-alert--success" role="status">{notice}</div>}
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <section className="admin-table-card" aria-labelledby="sport-list-title">
        <div className="admin-table-heading"><div><span className="admin-eyebrow">Database-backed registration</span><h2 id="sport-list-title">Sports</h2></div><span className="admin-count">{loading ? 'Loading…' : `${sports.length} total`}</span></div>
        {loading ? <p className="admin-empty">Loading sports…</p> : sports.length === 0 ? (
          <div className="admin-empty"><strong>No sports yet.</strong><span>Add a sport when its registration details are ready.</span></div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Sport</th><th>Google Form URL</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{sports.map((sport) => (
                <tr key={sport._id}>
                  <td className="admin-table__strong">{sport.order}</td>
                  <td>{sport.name}</td>
                  <td>{sport.formUrl ? <a className="admin-table-link" href={sport.formUrl} target="_blank" rel="noopener noreferrer">Configured</a> : <span className="admin-muted">Registration form not configured</span>}</td>
                  <td><span className={`admin-status ${sport.isActive ? 'admin-status--published' : 'admin-status--draft'}`}>{sport.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => openEdit(sport)}>Edit</button><button className="is-danger" type="button" onClick={() => setDeleteTarget(sport)}>Delete</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
      {formMode && <SportForm key={`${formMode}-${selectedSport?._id || 'new'}`} initialSport={selectedSport} onSubmit={handleSave} onCancel={() => setFormMode(null)} submitting={submitting} />}
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete this sport?" message="This removes its registration configuration from the public sports section." onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} confirming={deleting} />
    </div>
  )
}
