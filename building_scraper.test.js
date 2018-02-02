/* eslint-env jest */

const transformBuildings = require('./building_scraper').transformBuildings
const parseIntOrNull = require('./building_scraper').parseIntOrNull
const parseFloatOrNull = require('./building_scraper').parseFloatOrNull

const building = {
  abbr: '',
  name: 'The White House',
  address: '1600 Pennsylvania Ave NW, Washington DC',
  bldgID: '0',
  latitude: '0.0',
  longitude: '-0.0'
}

test('transform nulls blank strings, but not zero', () => {
  const buildingData = [building]
  expect(transformBuildings(buildingData).length).toBe(1)
  expect(transformBuildings(buildingData)[0].abbr).toBeNull()
  expect(transformBuildings(buildingData)[0].name).toBe('The White House')
  expect(transformBuildings(buildingData)[0].buildingNumber).toBe(0)
  expect(transformBuildings(buildingData)[0].latitude).toBeCloseTo(0.0, 2)
  expect(transformBuildings(buildingData)[0].longitude).toBeCloseTo(-0.0, 2)
})

test('parses latitude and longitude strings to floats', () => {
  const buildingData = Array(Object.assign(building, {
    latitude: 'notanumber',
    longitude: 'def not a num'
  }))
  expect(transformBuildings(buildingData)[0].name).toBe('The White House')
  expect(transformBuildings(buildingData)[0].latitude).toBeNull()
  expect(transformBuildings(buildingData)[0].longitude).toBeNull()
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
