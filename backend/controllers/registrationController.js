const { saveRegistration } = require('../services/registrationService')

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}

function isValidPhone(phone) {
  return /^\+?[\d\s()-]{8,18}$/.test(phone) && phone.replace(/\D/g, '').length >= 8
}

async function createRegistration(req, res) {
  const { sport, participantName, contactName, phone, email } = req.body || {}
  const values = { sport, participantName, contactName, phone, email }

  if (Object.values(values).some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ message: 'Please complete all required fields.' })
  }

  if (!isValidEmail(email.trim()) || !isValidPhone(phone.trim())) {
    return res.status(400).json({ message: 'Please enter valid contact details.' })
  }

  try {
    const registration = await saveRegistration({
      sport: sport.trim(),
      participantName: participantName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
    })

    return res.status(201).json({
      registration: {
        registrationId: registration.registrationId,
        sport: registration.sport,
        participantName: registration.participantName,
        contactName: registration.contactName,
        email: registration.email,
        createdAt: registration.createdAt,
      },
    })
  } catch {
    return res.status(500).json({ message: 'Unable to save registration.' })
  }
}

module.exports = { createRegistration }
