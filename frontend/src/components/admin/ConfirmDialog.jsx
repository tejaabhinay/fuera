export default function ConfirmDialog({ open, title, message, onCancel, onConfirm, confirming = false }) {
  if (!open) return null

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section className="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <span className="admin-eyebrow">Confirmation required</span>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>
        <div className="admin-form-actions">
          <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={confirming}>Cancel</button>
          <button className="admin-button admin-button--danger" type="button" onClick={onConfirm} disabled={confirming}>
            {confirming ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}
