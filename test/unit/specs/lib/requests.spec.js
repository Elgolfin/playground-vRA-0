/* global it beforeEach afterEach describe */
// ar path = require('path')
import request from 'request'
var expect = require('chai').expect
var sinon = require('sinon')
require('chai').should()

var requests = require('../../../../src/lib/requests')

var response200 = {statusCode: 200}
var response201 = {statusCode: 201}
var response404 = {statusCode: 404}

var deploymentOptions = {
  clientId: 1,
  projectId: 2,
  deploymentName: 3
}

var templateData = {
  description: 'description',
  data:
  {
    'hybris.Hostname.CID': 1,
    'hybris.Hostname.PID': 2,
    '_deploymentName': 3,
    'hybris.SSH.ssh_key': 4,
    JUMPBOX:
    {
      data:
      {
        'hybris.SSH.ssh_key': 5
      }
    }
  }
}

var body = {
  id: 1,
  requestCompletion: true,
  content:
  [
    {
      name: '1',
      catalogItemId: 1,
      links:
      [
            {href: 'link0', rel: 'rel0'},
            {href: 'link1', rel: 'rel1'}
      ]
    }
  ]}

describe('Requests', function () {
  'use strict'
  let sandbox
  'use strict'
  let requestGetStub
  'use strict'
  let requestPostStub
  'use strict'
  let consoleErrorStub

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    consoleErrorStub = sandbox.stub(console, 'error')
    requestGetStub = sandbox.stub(request, 'get')
    requestPostStub = sandbox.stub(request, 'post')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getAllCatalogItems method', function () {
    it('should return error when get request fails', function (done) {
      requestGetStub.yields('error', null, null)
      requests.getAllCatalogItems(function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
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

  describe('getAllCatalogItems method', function () {
    it('callback should return an error when getRequest fails', function (done) {
      requestGetStub.yields('error', null, null)
      requests.getAllCatalogItems(function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getAllCatalogItems method', function () {
    it('callback should return response body as error when getRequest returns a non-successful status code', function (done) {
      requestGetStub.yields(null, response404, body)
      requests.getAllCatalogItems(function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getAllCatalogItems method', function () {
    it('callback should return body item list when getRequest returns a 200 status code', function (done) {
      requestGetStub.yields(null, response200, body)
      requests.getAllCatalogItems(function (err, response) {
        expect(err).to.be.null

        // check that the items in the reponse match the # of items in the original
        // body content
        expect(JSON.parse(response).length).to.equal(body.content.length)
        done()
      })
    })
  })

  describe('getByName method', function () {
    it('callback should return an error when getRequest fails', function (done) {
      requestGetStub.yields('error', null, null)
      requests.getByName([], function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getByName method', function () {
    it('callback should return response body as error when getRequest status code is not 200', function (done) {
      requestGetStub.yields(null, response404, 'error')
      requests.getByName('name', function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getByName method', function () {
    it('should return body content when getRequest status code is 200', function (done) {
      requestGetStub.yields(null, response200, body)
      requests.getByName('name', function (err, response) {
        expect(err).to.be.null
        expect(response).to.equal(body.content[0])
        done()
      })
    })
  })

  describe('get method', function () {
    it('callback should return an error when getRequest fails', function (done) {
      requestGetStub.yields('error', null, null)
      requests.get([], function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('get method', function () {
    it('callback should return response body as error when getRequest status code is not 200', function (done) {
      requestGetStub.yields(null, response404, 'error')
      requests.get('name', function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('get method', function () {
    it('callback should return body content with only id and request completion when getRequest status code is 200 and raw parameter is false', function (done) {
      var params = {id: 1, raw: false}

      requestGetStub.yields(null, response200, body)
      requests.get(params, function (err, response) {
        expect(err).to.be.null
        expect(response.id).to.equal(body.id)
        expect(response.requestCompletion).to.equal(body.requestCompletion)
        expect(Object.keys(response).length).to.equal(2)
        done()
      })
    })
  })

  describe('get method', function () {
    it('callback should return body when getRequest status code is 200 and raw parameter is true', function (done) {
      var params = {id: 1, raw: true}

      requestGetStub.yields(null, response200, body)
      requests.get(params, function (err, response) {
        expect(err).to.be.null
        expect(response).to.equal(body)
        done()
      })
    })
  })

  describe('getAll method', function () {
    it('should return response body as error when getRequest status code is not 200', function (done) {
      requestGetStub.yields(null, response404, 'error')
      requests.getAll('name', function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getAll method', function () {
    it('callback should return an error when getRequest fails', function (done) {
      requestGetStub.yields('error', null, null)
      requests.getAll([], function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getAll method', function () {
    it('callback should return body when getRequest status code is 200', function (done) {
      requestGetStub.yields(null, response200, body)
      requests.getAll([], function (err, response) {
        expect(err).to.be.null
        expect(response).to.equal(body)
        done()
      })
    })
  })

  describe('sendRequest method', function () {
    it('should return error when getRequest fails', function (done) {
      requestPostStub.yields('error', null, null)
      requests.sendRequest([], [], function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('sendRequest method', function () {
    it('callback should return response body as error when getRequest status code is not 200', function (done) {
      requestPostStub.yields(null, response404, 'error')
      requests.sendRequest([], [], function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('sendRequest method', function () {
    it('should return body when getRequest status code is 201', function (done) {
      requestPostStub.yields(null, response201, body)
      requests.sendRequest([], [], function (err, response) {
        expect(err).to.be.null
        expect(response).to.equal(body)
        done()
      })
    })
  })

  describe('getTemplate method', function () {
    it('callback should return an error when getRequest fails', function (done) {
      requestGetStub.yields('error', null, null)
      requests.getTemplate([], function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getTemplate method', function () {
    it('callback should return response body as error when status code is not 200', function (done) {
      requestGetStub.yields(null, response404, 'error')
      requests.getTemplate('name', function (err, response) {
        expect(err).to.be.a('string')
        expect(response).to.be.undefined
        done()
      })
    })
  })

  describe('getTemplate method', function () {
    it('callback should return body when getRequest status code is 200', function (done) {
      requestGetStub.yields(null, response200, body)
      requests.getTemplate([], function (err, response) {
        expect(err).to.be.null
        expect(response).to.equal(body)
        done()
      })
    })
  })

  describe('submit method', function () {
    it('callback should return an error when blueprint name cannot be found', function (done) {
      var getByNameStub = sandbox.stub(requests, 'getByName')
      getByNameStub.yields('error', body)

      requests.submit([], function (err, response) {
        expect(err).to.be.a('string')
        done()
      })
    })
  })

  describe('submit method', function () {
    it('callback should return an error when the template cannot tbe found', function (done) {
      var getByNameStub = sandbox.stub(requests, 'getByName')
      var getTemplateStub = sandbox.stub(requests, 'getTemplate')
      getByNameStub.yields(null, body.content[0])
      getTemplateStub.yields('error', body)

      requests.submit([], function (err, response) {
        expect(err).to.be.a('string')
        done()
      })
    })
  })

  describe('submit method', function () {
    it('callback should return an error when sendRequest fails with valid blueprint name and template', function (done) {
      var getByNameStub = sandbox.stub(requests, 'getByName')
      var getTemplateStub = sandbox.stub(requests, 'getTemplate')
      var sendRequestStub = sandbox.stub(requests, 'sendRequest')

      getByNameStub.yields(null, body.content[0])
      getTemplateStub.yields(null, templateData)
      sendRequestStub.yields('error', null)

      requests.submit(deploymentOptions, function (err, response) {
        expect(err).to.be.a('string')
        expect(consoleErrorStub.callCount).to.equal(1)
        done()
      })
    })
  })

  describe('submit method', function () {
    it('callback should properly execute with a valid blueprint name and template', function (done) {
      var getByNameStub = sandbox.stub(requests, 'getByName')
      var getTemplateStub = sandbox.stub(requests, 'getTemplate')
      var sendRequestStub = sandbox.stub(requests, 'sendRequest')

      getByNameStub.yields(null, body.content[0])
      getTemplateStub.yields(null, templateData)
      sendRequestStub.yields(null, 'response')

      requests.submit(deploymentOptions, function (err, response) {
        expect(err).to.be.null
        expect(response).to.be.a('string')
        done()
      })
    })
  })
})
