const path = require('node:path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Sport = require('../models/Sport')
const { connectDatabase, isDatabaseReady } = require('../config/database')

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const sports = [
  {
    name: 'Badminton',
    order: 1,
    imageUrl: 'https://res.cloudinary.com/zmi9n0ms/image/upload/v1789213872/badminton.jpg',
  },
  {
    name: 'Cricket',
    order: 2,
    imageUrl: 'https://res.cloudinary.com/zmi9n0ms/image/upload/v1789214075/cricket.jpg',
  },
  {
    name: 'Volleyball',
    order: 3,
    imageUrl: 'https://res.cloudinary.com/zmi9n0ms/image/upload/v1789214075/volleyball.jpg',
  },
  {
    name: 'Football',
    order: 4,
    imageUrl: 'https://res.cloudinary.com/zmi9n0ms/image/upload/v1789214075/soccer.jpg',
  },
  {
    name: 'Basketball',
    order: 5,
    imageUrl: 'https://res.cloudinary.com/zmi9n0ms/image/upload/v1789214075/basketball.jpg',
  },
]

async function initializeSports() {
  const connected = await connectDatabase()
  if (!connected || !isDatabaseReady()) throw new Error('MongoDB connection unavailable; sports were not initialized.')

  const operations = sports.map((sport) => ({
    updateOne: {
      filter: { name: sport.name },
      update: {
        $set: { imageUrl: sport.imageUrl },
        $setOnInsert: { name: sport.name, isActive: true, order: sport.order },
      },
      upsert: true,
    },
  }))

  const result = await Sport.bulkWrite(operations)
  console.log(`Sports initialized. Created: ${result.upsertedCount || 0}; image records updated: ${sports.length}.`)
}

if (require.main === module) {
  initializeSports()
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
    .finally(async () => {
      await mongoose.disconnect()
    })
}

module.exports = { initializeSports }
