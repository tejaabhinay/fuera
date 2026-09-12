const express = require('express')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const {
  createFixture,
  deleteFixture,
  getFixture,
  listFixtures,
  updateFixture,
  validateFixtureRequest,
} = require('../controllers/fixtureController')

const router = express.Router()

router.get('/', requireDatabase, listFixtures)
router.post('/', requireAuth, validateFixtureRequest, requireDatabase, createFixture)
router.get('/:id', validateObjectId('fixture'), requireDatabase, getFixture)
router.patch('/:id', requireAuth, validateObjectId('fixture'), validateFixtureRequest, requireDatabase, updateFixture)
router.delete('/:id', requireAuth, validateObjectId('fixture'), requireDatabase, deleteFixture)

module.exports = router
