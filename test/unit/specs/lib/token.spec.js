/* global it beforeEach afterEach describe */
// var path = require('path')
var expect = require('chai').expect
var sinon = require('sinon')
import token from '../../../../src/lib/token'
import fs from 'fs'
import extfs from 'extfs'
require('chai').should()

describe('Token', function () {
  'use strict'
  let sandbox
  // eslint-disable-next-line
  let doesVMWareTokenExistStub
    // eslint-disable-next-line
  let saveVMwareTokenStub

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('doesVMWareTokenExist method', function () {
    it('should return false if the token file does not exist', function () {
      var fsExistsStub = sandbox.stub(fs, 'existsSync')
      fsExistsStub.returns(false)

      var result = token.doesVMWareTokenExist()
      expect(result).to.equal(false)
    })
  })

  describe('doesVMWareTokenExist method', function () {
    it('should return false if the token file is empty', function () {
      var fsExistsStub = sandbox.stub(fs, 'existsSync')
      fsExistsStub.returns(true)

      var extfsStub = sandbox.stub(extfs, 'isEmptySync')
      extfsStub.returns(true)

      var result = token.doesVMWareTokenExist()
      expect(result).to.equal(false)
    })
  })

  describe('doesVMWareTokenExist method', function () {
    it('should return true if the token file is populated with a token', function () {
      var fsExistsStub = sandbox.stub(fs, 'existsSync')
      fsExistsStub.returns(true)

      var extfsStub = sandbox.stub(extfs, 'isEmptySync')
      extfsStub.returns(false)

      var result = token.doesVMWareTokenExist()
      expect(result).to.equal(true)
    })
  })
}
)
