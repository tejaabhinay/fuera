const Admin = require('../models/Admin')
const { hashPassword, normalizeEmail, validateCredentials } = require('../services/adminCredentials')
const { isPlainObject } = require('./authController')

function validateAdminRequest(req, res, next) {
  const { email, password, confirmPassword } = req.body || {}
  const validationMessage = validateCredentials(email, password)
  if (!isPlainObject(req.body) || validationMessage || password !== confirmPassword) {
    return res.status(400).json({ message: validationMessage || 'Passwords do not match' })
  }
  req.adminCredentials = { email: normalizeEmail(email), password }
  return next()
}

async function listAdmins(req, res) {
  const admins = await Admin.find().select('email createdAt').sort({ createdAt: 1, _id: 1 }).lean()
  return res.json({ admins: admins.map((admin) => ({ id: admin._id.toString(), email: admin.email, createdAt: admin.createdAt })) })
}

async function createAdmin(req, res) {
  try {
    const passwordHash = await hashPassword(req.adminCredentials.password)
    const admin = await Admin.create({ email: req.adminCredentials.email, passwordHash })
    return res.status(201).json({ admin: { id: admin._id.toString(), email: admin.email, createdAt: admin.createdAt } })
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'An admin with that email already exists' })
    throw error
  }
}

async function deleteAdmin(req, res) {
  if (req.params.id === req.admin.id) return res.status(400).json({ message: 'You cannot delete your own admin account' })
  if ((await Admin.countDocuments()) <= 1) return res.status(400).json({ message: 'The final administrator cannot be deleted' })

  const admin = await Admin.findByIdAndDelete(req.params.id).select('_id').lean()
  if (!admin) return res.status(404).json({ message: 'Admin not found' })
  return res.status(204).send()
}

module.exports = { listAdmins, createAdmin, deleteAdmin, validateAdminRequest }
