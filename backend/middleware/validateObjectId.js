const mongoose = require('mongoose')

function validateObjectId(resourceName = 'resource') {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: `Invalid ${resourceName} id` })
    }

    return next()
  }
}

module.exports = { validateObjectId }
