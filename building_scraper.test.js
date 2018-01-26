/* eslint-env jest */

const transformBuildings = require('./building_scraper').transformBuildings

test('transform nulls blank strings, but not zero', () => {
  const buildingData = [{
    abbr: '',
    name: 'The White House',
    address: '1600 Pennsylvania Ave NW, Washington DC',
    bldgID: 0,
    latitude: 0.0,
    longitude: -0.0
  }]

  expect(transformBuildings(buildingData).length).toBe(1)
  expect(transformBuildings(buildingData)[0].abbr).toBeNull()
  expect(transformBuildings(buildingData)[0].name).toBe('The White House')
  expect(transformBuildings(buildingData)[0].buildingNumber).toBe(0)
  expect(transformBuildings(buildingData)[0].latitude).toBe(0.0)
  expect(transformBuildings(buildingData)[0].longitude).toBe(-0.0)
})
