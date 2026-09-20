import { useEffect, useState } from 'react'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import LeaderboardForm from '../../components/admin/LeaderboardForm'
import { apiRequest, getApiErrorMessage } from '../../services/api'

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    apiRequest('/api/leaderboard/admin')
      .then((data) => { if (active) setEntries(data?.leaderboard || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load the standings. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  const openCreate = () => { setNotice(''); setError(''); setSelectedEntry(null); setFormMode('create') }
  const openEdit = (entry) => { setNotice(''); setError(''); setSelectedEntry(entry); setFormMode('edit') }

  const handleSave = async (payload) => {
    setSubmitting(true)
    try {
      await apiRequest(selectedEntry ? `/api/leaderboard/${selectedEntry._id}` : '/api/leaderboard', {
        method: selectedEntry ? 'PATCH' : 'POST',
        body: payload,
      })
      setFormMode(null)
      setNotice(selectedEntry ? 'Department updated successfully.' : 'Department added successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save the department. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiRequest(`/api/leaderboard/${deleteTarget._id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      setNotice('Department removed from the standings.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to remove the department. Please try again.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header--compact">
        <div>
          <span className="admin-eyebrow">Content / Standings</span>
          <h1>Points<br /><em>table.</em></h1>
        </div>
        <button className="admin-button admin-button--primary" type="button" onClick={openCreate}>+ Add department</button>
      </header>

      {notice && <div className="admin-alert admin-alert--success" role="status">{notice}</div>}
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}

      <section className="admin-table-card" aria-labelledby="standings-list-title">
        <div className="admin-table-heading">
          <div>
            <span className="admin-eyebrow">Ranked on gold, then silver, then bronze</span>
            <h2 id="standings-list-title">Departments</h2>
          </div>
          <span className="admin-count">{loading ? 'Loading…' : `${entries.length} total`}</span>
        </div>

        {loading ? <p className="admin-empty">Loading standings…</p> : entries.length === 0 ? (
          <div className="admin-empty">
            <strong>No departments yet.</strong>
            <span>Add departments as medals are awarded. The public standings stay hidden until at least one exists.</span>
          </div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th><th>Department</th><th>Gold</th><th>Silver</th><th>Bronze</th><th>Total</th><th>Status</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="admin-table__strong">{entry.rank}</td>
                    <td>{entry.department}</td>
                    <td>{entry.gold}</td>
                    <td>{entry.silver}</td>
                    <td>{entry.bronze}</td>
                    <td className="admin-table__strong">{entry.total}</td>
                    <td>
                      <span className={`admin-status ${entry.isPublished ? 'admin-status--published' : 'admin-status--draft'}`}>
                        {entry.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" onClick={() => openEdit(entry)}>Edit</button>
                        <button className="is-danger" type="button" onClick={() => setDeleteTarget(entry)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {formMode && (
        <LeaderboardForm
          key={`${formMode}-${selectedEntry?._id || 'new'}`}
          initialEntry={selectedEntry}
          onSubmit={handleSave}
          onCancel={() => setFormMode(null)}
          submitting={submitting}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove this department?"
        message="It will disappear from the public championship standings."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirming={deleting}
      />
    </div>
  )
}
