const rp = require('request-promise-native')
const MongoClient = require('mongodb').MongoClient

exports.scrapeBuildings = (mongoConnection, apiKey) => {
  return rp(`https://api.oregonstate.edu/v1/locations/?apikey=${apiKey}&page%5Bsize%5D=10`)
    .then((body) => {
      const buildingData = JSON.parse(body).data
      insertBuildingDataToMongo(mongoConnection, buildingData)
    })
    .catch((err) => {
      throw err
    })
}

const insertBuildingDataToMongo = async (mongoConnection, buildingData) => {
  try {
    const buildings = mongoConnection.db('test').collection('buildings')
    await buildings.insertMany(buildingData)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

if (require.main === module) {
  (async function () {
    const apiKey = process.env.API_KEY
    if (apiKey == null) throw new Error('No API_KEY specified for OSU Buildings API')

    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/test'
    let client

    try {
      client = await MongoClient.connect(mongoUrl)
    } catch (err) {
      console.log(err)
      process.exit(1)
    }

    await exports.scrapeBuildings(client, apiKey)
    console.log('Sucessfully inserted building data')
    client.close()
  })()
}
