import { useId, useState } from 'react'
import { getApiErrorMessage, uploadImage } from '../../services/api'

export default function ImageUploadField({ value, folder, label = 'Image', onChange, disabled = false }) {
  const inputId = useId()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Choose a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5 MB or smaller.')
      return
    }

    setUploading(true)
    try {
      const result = await uploadImage(file, folder)
      onChange(result.imageUrl)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Image upload failed. Please try again.'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="admin-image-upload">
      <div className="admin-image-upload__heading"><span>{label}</span><small>JPEG, PNG, or WebP · max 5 MB</small></div>
      {value && <img className="admin-image-upload__preview" src={value} alt="Current upload preview" />}
      <div className="admin-image-upload__controls">
        <label className="admin-button admin-button--quiet" htmlFor={inputId}>{uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}</label>
        <input id={inputId} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} disabled={disabled || uploading} />
        {value && <span className="admin-image-upload__status">Uploaded image ready to save</span>}
      </div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
    </div>
  )
}
