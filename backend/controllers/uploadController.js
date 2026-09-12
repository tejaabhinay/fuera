const { uploadImageBuffer } = require('../config/cloudinary')

const folders = {
  sports: 'fuera/sports',
  fixtures: 'fuera/fixtures',
  timeline: 'fuera/timeline',
  'previous-editions': 'fuera/previous-editions',
}

function hasSupportedImageSignature(buffer, mimetype) {
  if (mimetype === 'image/jpeg') return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
  if (mimetype === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (mimetype === 'image/webp') return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
  return false
}

async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: 'An image file is required' })
  if (!hasSupportedImageSignature(req.file.buffer, req.file.mimetype)) return res.status(400).json({ message: 'The uploaded file is not a supported image' })

  const folder = folders[req.body.folder || req.body.category]
  if (!folder) return res.status(400).json({ message: 'A valid image category is required' })

  try {
    const result = await uploadImageBuffer(req.file.buffer, folder)
    if (!result?.secure_url || !result?.public_id) return res.status(502).json({ message: 'Image upload failed. Please try again.' })
    return res.status(201).json({ imageUrl: result.secure_url, publicId: result.public_id })
  } catch (error) {
    if (error.code === 'CLOUDINARY_NOT_CONFIGURED') return res.status(503).json({ message: 'Image uploads are not configured' })
    return res.status(502).json({ message: 'Image upload failed. Please try again.' })
  }
}

module.exports = { uploadImage }
