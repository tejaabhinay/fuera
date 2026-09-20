const express = require('express')
const { requireDatabase } = require('../middleware/database')
const { requireAuth } = require('../middleware/authMiddleware')
const { validateObjectId } = require('../middleware/validateObjectId')
const { noStore, publicCache } = require('../middleware/cache')
const {
  createFixture,
  deleteFixture,
  getFixture,
  listFixtures,
  updateFixture,
  validateFixtureRequest,
} = require('../controllers/fixtureController')

const router = express.Router()

router.get('/', publicCache(30), requireDatabase, listFixtures)
router.post('/', noStore, requireAuth, validateFixtureRequest, requireDatabase, createFixture)
router.get('/:id', publicCache(30), validateObjectId('fixture'), requireDatabase, getFixture)
router.patch('/:id', noStore, requireAuth, validateObjectId('fixture'), validateFixtureRequest, requireDatabase, updateFixture)
router.delete('/:id', noStore, requireAuth, validateObjectId('fixture'), requireDatabase, deleteFixture)

module.exports = router
