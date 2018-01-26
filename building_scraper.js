const rp = require('request-promise-native')
const MongoClient = require('mongodb').MongoClient

// Returns a promise to scrape OSU buildings
const scrapeBuildings = async (apiKey) => {
  return rp(`https://api.oregonstate.edu/v1/locations/?apikey=${apiKey}&page%5Bsize%5D=10000`)
    .then((body) => {
      const buildingData = JSON.parse(body).data
      return buildingData.map(b => b.attributes)
    })
}

const transformBuildings = (buildingData) => {
  return buildingData.map(building => {
    return {
      abbr: building.abbreviation || null,
      name: building.name || null,
      address: building.address || null,
      buildingNumber: building.bldgID || null,
      latitude: building.latitude || null,
      longitude: building.longitude || null
    }
  })
}

// Returns a promise to insert building data into MongoDB
const insertBuildingDataToMongo = (mongoConnection, buildingData) => {
  try {
    const buildings = mongoConnection.db('test').collection('buildings')
    return buildings.insertMany(buildingData)
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

    try {
      const buildings = await scrapeBuildings(apiKey).then(transformBuildings)
      await insertBuildingDataToMongo(client, buildings)
    } catch (err) {
      console.log(err)
      process.exit(1)
    }

    console.log('Sucessfully inserted building data')
    client.close()
  })()
}

exports.scrapeBuildings = scrapeBuildings
