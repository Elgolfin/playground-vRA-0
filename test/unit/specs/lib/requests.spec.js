/* global it beforeEach afterEach describe */
// ar path = require('path')
var expect = require('chai').expect
var sinon = require('sinon')
require('chai').should()

var requests = require('../../../../src/lib/requests')

describe('Requests', function () {
  'use strict'
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getObjectFromKey method', function () {
    it('should return the object when the key is present in the entries Array', function () {
      var jsonSample = {
        entries: [
          {key: 'test'}
        ]
      }
      var obj = requests.getObjectFromKey(jsonSample, 'test')
      expect(obj).to.deep.equal({key: 'test'})
      obj.value = 'value'
      expect(jsonSample.entries[0].value).to.deep.equal('value')
    })

    it('should return null when the key is not present in the entries Array', function () {
      var jsonSample = {
        entries: [
          {'hybris.Hostname.CID': 'te'}
        ]
      }
      expect(requests.getObjectFromKey(jsonSample, 'test')).to.deep.equal(null)
    })
  })
})
