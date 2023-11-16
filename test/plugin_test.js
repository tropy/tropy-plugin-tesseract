const assert = require('node:assert')
const TesseractPlugin = require('../index.js')

describe('TesseractPlugin', () => {

  it('exists', () => {
    assert.equal(typeof TesseractPlugin, 'function')
  })

  it('responds to extract hook', () => {
    assert.equal(typeof (new TesseractPlugin).extract, 'function')
  })
})
