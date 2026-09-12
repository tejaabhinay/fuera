import { useEffect, useState } from 'react'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import TimelineForm from '../../components/admin/TimelineForm'
import { apiRequest, getApiErrorMessage } from '../../services/api'

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

export default function AdminTimelinePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    apiRequest('/api/timeline/admin')
      .then((data) => { if (active) setEvents(data?.events || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load timeline events. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  const openCreate = () => { setNotice(''); setSelectedEvent(null); setFormMode('create') }
  const openEdit = (event) => { setNotice(''); setSelectedEvent(event); setFormMode('edit') }

  const handleSave = async (payload) => {
    setSubmitting(true)
    try {
      await apiRequest(selectedEvent ? `/api/timeline/${selectedEvent._id}` : '/api/timeline', {
        method: selectedEvent ? 'PATCH' : 'POST',
        body: payload,
      })
      setFormMode(null)
      setNotice(selectedEvent ? 'Timeline event updated successfully.' : 'Timeline event created successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save timeline event. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiRequest(`/api/timeline/${deleteTarget._id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      setNotice('Timeline event deleted successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete timeline event. Please try again.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header--compact">
        <div>
          <span className="admin-eyebrow">Content / Homepage</span>
          <h1>Keep the<br /><em>story moving.</em></h1>
        </div>
        <button className="admin-button admin-button--primary" type="button" onClick={openCreate}>+ Add event</button>
      </header>

      {notice && <div className="admin-alert admin-alert--success" role="status">{notice}</div>}
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <section className="admin-table-card" aria-labelledby="timeline-list-title">
        <div className="admin-table-heading">
          <div><span className="admin-eyebrow">Homepage dates</span><h2 id="timeline-list-title">Timeline</h2></div>
          <span className="admin-count">{loading ? 'Loading…' : `${events.length} total`}</span>
        </div>
        {loading ? <p className="admin-empty">Loading timeline…</p> : events.length === 0 ? (
          <div className="admin-empty"><strong>No timeline events yet.</strong><span>Add an event when the programme is ready.</span></div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead><tr><th>Title</th><th>Date</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{events.map((event) => (
                <tr key={event._id}>
                  <td className="admin-table__strong">{event.title}</td>
                  <td>{formatDate(event.date)}</td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => openEdit(event)}>Edit</button><button className="is-danger" type="button" onClick={() => setDeleteTarget(event)}>Delete</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>

      {formMode && <TimelineForm key={`${formMode}-${selectedEvent?._id || 'new'}`} initialEvent={selectedEvent} onSubmit={handleSave} onCancel={() => setFormMode(null)} submitting={submitting} />}
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete this event?" message="This action permanently removes the event from the homepage timeline." onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} confirming={deleting} />
    </div>
  )
}
