import { useEffect, useState } from 'react'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ArchiveForm from '../../components/admin/ArchiveForm'
import { apiRequest, getApiErrorMessage } from '../../services/api'

function formatArchiveLabel(archive) {
  return [archive.title, archive.year].filter(Boolean).join(' / ') || 'Untitled archive image'
}

export default function AdminArchivePage() {
  const [archives, setArchives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [selectedArchive, setSelectedArchive] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    apiRequest('/api/previous-editions/admin')
      .then((data) => { if (active) setArchives(data?.previousEditions || []) })
      .catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Unable to load archive images. Please try again.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  const openCreate = () => { setNotice(''); setSelectedArchive(null); setFormMode('create') }
  const openEdit = (archive) => { setNotice(''); setSelectedArchive(archive); setFormMode('edit') }

  const handleSave = async (payload) => {
    setSubmitting(true)
    try {
      await apiRequest(selectedArchive ? `/api/previous-editions/${selectedArchive._id}` : '/api/previous-editions', { method: selectedArchive ? 'PATCH' : 'POST', body: payload })
      setFormMode(null)
      setNotice(selectedArchive ? 'Archive image updated successfully.' : 'Archive image added successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save archive image. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiRequest(`/api/previous-editions/${deleteTarget._id}`, { method: 'DELETE' })
      setDeleteTarget(null)
      setNotice('Archive image deleted successfully.')
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete archive image. Please try again.'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header--compact">
        <div><span className="admin-eyebrow">Content / Homepage</span><h1>From the<br /><em>archive.</em></h1></div>
        <button className="admin-button admin-button--primary" type="button" onClick={openCreate}>+ Add archive image</button>
      </header>
      {notice && <div className="admin-alert admin-alert--success" role="status">{notice}</div>}
      {error && <div className="admin-alert admin-alert--error" role="alert">{error}</div>}
      <section className="admin-table-card" aria-labelledby="archive-list-title">
        <div className="admin-table-heading"><div><span className="admin-eyebrow">Cloudinary-backed photography</span><h2 id="archive-list-title">Archive</h2></div><span className="admin-count">{loading ? 'Loading…' : `${archives.length} total`}</span></div>
        {loading ? <p className="admin-empty">Loading archive images…</p> : archives.length === 0 ? (
          <div className="admin-empty"><strong>No archive images yet.</strong><span>Upload a real previous-edition photograph when ready.</span></div>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Image</th><th>Details</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>{archives.map((archive) => (
                <tr key={archive._id}>
                  <td className="admin-table__strong">{archive.order}</td>
                  <td><img className="admin-archive-thumb" src={archive.imageUrl} alt={formatArchiveLabel(archive)} /></td>
                  <td className="admin-table__strong">{formatArchiveLabel(archive)}</td>
                  <td><span className={`admin-status ${archive.isPublished ? 'admin-status--published' : 'admin-status--draft'}`}>{archive.isPublished ? 'Published' : 'Unpublished'}</span></td>
                  <td><div className="admin-row-actions"><button type="button" onClick={() => openEdit(archive)}>Edit</button><button className="is-danger" type="button" onClick={() => setDeleteTarget(archive)}>Delete</button></div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
      {formMode && <ArchiveForm key={`${formMode}-${selectedArchive?._id || 'new'}`} initialArchive={selectedArchive} onSubmit={handleSave} onCancel={() => setFormMode(null)} submitting={submitting} />}
      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete this archive image?" message="This removes the image from the public previous-edition archive." onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} confirming={deleting} />
    </div>
  )
}
