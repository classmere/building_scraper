/* eslint-env jest */

const fs = require('fs')
const processResponse = require('./building_scraper').processResponse
const transformBuilding = require('./building_scraper').transformBuilding
const transformBuildings = require('./building_scraper').transformBuildings
const parseIntOrNull = require('./building_scraper').parseIntOrNull
const parseFloatOrNull = require('./building_scraper').parseFloatOrNull

const building = {
  abbreviation: '',
  name: 'The White House',
  address: '1600 Pennsylvania Ave NW, Washington DC',
  bldgID: '0',
  latitude: '0.0',
  longitude: '-0.0'
}

const sampleResponse = processResponse(fs.readFileSync('./sample_response.json'))

test('transform nulls blank strings, but not zero', () => {
  expect(transformBuildings(sampleResponse).length).toBe(sampleResponse.length)
  expect(transformBuilding(building).abbr).toBeNull()
  expect(transformBuilding(building).name).toBe('The White House')
  expect(transformBuilding(building).buildingNumber).toBe(0)
  expect(transformBuilding(building).latitude).toBeCloseTo(0.0, 2)
  expect(transformBuilding(building).longitude).toBeCloseTo(-0.0, 2)
})

test('parses latitude and longitude strings to floats', () => {
  const buildingData = {
    ...building,
    latitude: 'notanumber',
    longitude: 'def not a num'
  }
  expect(transformBuilding(buildingData).name).toBe('The White House')
  expect(transformBuilding(buildingData).latitude).toBeNull()
  expect(transformBuilding(buildingData).longitude).toBeNull()
})

test('parseIntOrNull functions as expected', () => {
  expect(parseIntOrNull(0)).toBe(0)
  expect(parseIntOrNull(1.793)).toBe(1)
  expect(parseIntOrNull(-4.793)).toBe(-4)
  expect(parseIntOrNull('9872435')).toBe(9872435)
  expect(parseIntOrNull('-7')).toBe(-7)
  expect(parseIntOrNull('-3.141')).toBe(-3)
  expect(parseIntOrNull('not a num')).toBe(null)
  expect(parseIntOrNull(null)).toBeNull()
  expect(parseIntOrNull({})).toBeNull()
})

test('parseFloatOrNull functions as expected', () => {
  expect(parseFloatOrNull(0)).toBeCloseTo(0, 5)
  expect(parseFloatOrNull(1.793)).toBeCloseTo(1.793, 5)
  expect(parseFloatOrNull(-4.793)).toBeCloseTo(-4.793, 5)
  expect(parseFloatOrNull('9872435')).toBeCloseTo(9872435.0, 5)
  expect(parseFloatOrNull('-7')).toBeCloseTo(-7.0, 5)
  expect(parseFloatOrNull('-3.141')).toBeCloseTo(-3.141)
  expect(parseFloatOrNull('not a num')).toBeNull()
  expect(parseFloatOrNull(null)).toBeNull()
  expect(parseFloatOrNull({})).toBeNull()
})

test('converts all abbreviations to uppercase', () => {
  expect(transformBuilding({...building, abbreviation: 'WH'}).abbr).toBe('WH')
  expect(transformBuilding({...building, abbreviation: 'Wh'}).abbr).toBe('WH')
  expect(transformBuilding({...building, abbreviation: 'cApiTaliZ3Th1s'}).abbr).toBe('CAPITALIZ3TH1S')
  for (const b of transformBuildings(sampleResponse)) {
    if (b.abbr != null) {
      expect(typeof b.abbr).toBe('string')
    }
  }
})
