import { useEffect, useState } from 'react'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import FixtureForm from '../../components/admin/FixtureForm'
import { apiRequest, getApiErrorMessage } from '../../services/api'

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function fixtureLabel(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '—'
}

export default function AdminFixturesPage() {
  const [fixtures, setFixtures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [selectedFixture, setSelectedFixture] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    apiRequest('/api/fixtures')
      .then((data) => { if (active) setFixtures(data?.fixtures || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load fixtures. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  const openCreate = () => { setNotice(''); setSelectedFixture(null); setFormMode('create') }
  const openEdit = (fixture) => { setNotice(''); setSelectedFixture(fixture); setFormMode('edit') }

  const handleSave = async (payload) => {
    setSubmitting(true)
    try {
      await apiRequest(selectedFixture ? `/api/fixtures/${selectedFixture._id}` : '/api/fixtures', {
        method: selectedFixture ? 'PATCH' : 'POST',
        body: payload,
      })
      setFormMode(null)
      setNotice(selectedFixture ? 'Fixture updated successfully.' : 'Fixture created successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save fixture. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiRequest(`/api/fixtures/${deleteTarget._id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      setNotice('Fixture deleted successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete fixture. Please try again.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header--compact">
        <div>
          <span className="admin-eyebrow">Content / Fixtures</span>
          <h1>Match<br /><em>day.</em></h1>
        </div>
        <button className="admin-button admin-button--primary" type="button" onClick={openCreate}>+ Add fixture</button>
      </header>

      {notice && <div className="admin-alert admin-alert--success" role="status">{notice}</div>}
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <section className="admin-table-card" aria-labelledby="fixture-list-title">
        <div className="admin-table-heading">
          <div><span className="admin-eyebrow">Live content</span><h2 id="fixture-list-title">Fixtures</h2></div>
          <span className="admin-count">{loading ? 'Loading…' : `${fixtures.length} total`}</span>
        </div>
        {loading ? <p className="admin-empty">Loading fixtures…</p> : fixtures.length === 0 ? (
          <div className="admin-empty"><strong>No fixtures yet.</strong><span>Add the first published schedule item when it is ready.</span></div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead><tr><th>Sport</th><th>Round</th><th>Match</th><th>Date / time</th><th>Venue</th><th>Status</th><th>Score</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{fixtures.map((fixture) => (
                <tr key={fixture._id}>
                  <td className="admin-table__strong">{fixtureLabel(fixture.sport)}</td>
                  <td>{fixture.round || '—'}</td>
                  <td>{fixture.teamA || 'TBD'} <span className="admin-vs">vs</span> {fixture.teamB || 'TBD'}</td>
                  <td>{formatDate(fixture.date)}<small>{fixture.time || 'Time TBC'}</small></td>
                  <td>{fixture.venue || '—'}</td>
                  <td><span className={`admin-status admin-status--${fixture.status}`}>{fixture.status}</span></td>
                  <td>{fixture.scoreA ?? '—'} <span className="admin-vs">:</span> {fixture.scoreB ?? '—'}</td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => openEdit(fixture)}>Edit</button><button className="is-danger" type="button" onClick={() => setDeleteTarget(fixture)}>Delete</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>

      {formMode && <FixtureForm key={`${formMode}-${selectedFixture?._id || 'new'}`} initialFixture={selectedFixture} onSubmit={handleSave} onCancel={() => setFormMode(null)} submitting={submitting} />}
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete this fixture?" message="This action permanently removes the fixture from the schedule." onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} confirming={deleting} />
    </div>
  )
}
