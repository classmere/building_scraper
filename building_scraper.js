const rp = require('request-promise-native')
const MongoClient = require('mongodb').MongoClient

// Returns a promise to scrape OSU buildings
async function scrapeBuildings (apiKey) {
  const response = await rp(`https://api.oregonstate.edu/v1/locations/?apikey=${apiKey}&page%5Bsize%5D=10000`)
  return processResponse(response)
}

function processResponse (responseData) {
  return JSON.parse(responseData).data.map(b => b.attributes)
}

function parseAbbreviationOrNull (abbreviation) {
  if (typeof abbreviation === 'string' && abbreviation != null) {
    return abbreviation.length > 0 ? abbreviation.toUpperCase() : null
  } else {
    return null
  }
}

function parseIntOrNull (number) {
  return isNaN(parseInt(number, 10)) ? null : parseInt(number, 10)
}

function parseFloatOrNull (number) {
  return isNaN(parseFloat(number)) ? null : parseFloat(number)
}

// Strips unnecessary fields from retrieved building data
function transformBuilding (building) {
  return {
    abbr: parseAbbreviationOrNull(building.abbreviation),
    name: building.name || null,
    address: building.address || null,
    buildingNumber: parseIntOrNull(building.bldgID),
    latitude: parseFloatOrNull(building.latitude),
    longitude: parseFloatOrNull(building.longitude)
  }
}

// Strips unnecessary fields from retrieved building data array
function transformBuildings (buildingArray) {
  return buildingArray.map(transformBuilding)
}

if (require.main === module) {
  (async function () {
    const apiKey = process.env.API_KEY
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/test'
    if (apiKey == null) throw new Error('No API_KEY specified for OSU Buildings API')

    try {
      const client = await MongoClient.connect(mongoUrl)
      const buildingsCollection = client.db('test').collection('buildings')

      const buildings = await scrapeBuildings(apiKey).then(transformBuildings)
      await buildingsCollection.deleteMany({})
      const insertResult = await buildingsCollection.insertMany(buildings)

      console.log(`Sucessfully inserted data for ${insertResult.insertedCount} buildings`)
      client.close()
    } catch (err) {
      console.log(err)
      process.exit(1)
    }
  })()
}

exports.scrapeBuildings = scrapeBuildings
exports.processResponse = processResponse
exports.transformBuilding = transformBuilding
exports.transformBuildings = transformBuildings
exports.parseIntOrNull = parseIntOrNull
exports.parseFloatOrNull = parseFloatOrNull
