/* global it beforeEach afterEach describe */
// var path = require('path')
var expect = require('chai').expect
var sinon = require('sinon')
import command from '../../../../src/lib/command'
import token from '../../../../src/lib/token'
import prompt from 'prompt'
import program from 'commander'
import logger from '../../../../src/lib/logger'
require('chai').should()

describe('Command', function () {
  'use strict'
  let sandbox
    // eslint-disable-next-line
  let promptStubStart
  // eslint-disable-next-line
  let promptStubGet
  // eslint-disable-next-line
  let programParse
  // eslint-disable-next-line
  let tokenExistsStub
  // eslint-disable-next-line
  let programHelpStub
  // eslint-disable-next-line
  let loggerErrorStub
  // eslint-disable-next-line
  let processExitStub
  // eslint-disable-next-line
  let consoleErrorStub

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    promptStubStart = sandbox.stub(prompt, 'start')
    promptStubGet = sandbox.stub(prompt, 'get')
    programParse = sandbox.stub(program, 'parse')
    tokenExistsStub = sandbox.stub(token, 'doesVMWareTokenExist')
    programHelpStub = sandbox.stub(program, 'help')
    loggerErrorStub = sandbox.stub(logger, 'error')
    processExitStub = sandbox.stub(process, 'exit')
    consoleErrorStub = sandbox.stub(console, 'error')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('exec method', function () {
    it('should log error when error occurs checking if a VMware token exists', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields('error', true)

      command.exec([], function () {
        expect(consoleErrorStub.callCount).to.equal(1)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('callback should properly execute when a token file exists and all required parameters have been provided', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, true)

      var callback = sinon.stub()
      command.exec([], callback)

      expect(callback.called).to.equal(true)
      done()
    })
  })

  describe('exec method', function () {
    it('callback should properly execute when a password is entered at the prompt and all required parameters have been provided', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, false)

      promptStubGet.callsArgWith(1, null, {password: 'pwd'})

      command.exec([], function () {
        expect(promptStubGet.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for missing tenant parameter when tenant parameter is missing and token file is exists', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = ''
      tokenExistsStub.yields(null, true)

      command.exec([], function () {
        expect(programHelpStub.callCount).to.equal(1)
        expect(processExitStub.calledWith(1)).to.equal(true)
        expect(loggerErrorStub.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for missing hostname parameter when hostname parameter is missing and token file exists', function (done) {
      program.username = 'username'
      program.hostname = ''
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, true)

      command.exec([], function () {
        expect(programHelpStub.callCount).to.equal(1)
        expect(processExitStub.calledWith(1)).to.equal(true)
        expect(loggerErrorStub.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for missing username parameter when username parameter is missing and token file exists', function (done) {
      program.username = ''
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, true)

      command.exec([], function () {
        expect(programHelpStub.callCount).to.equal(1)
        expect(processExitStub.calledWith(1)).to.equal(true)
        expect(loggerErrorStub.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for additional missing parameter when additional parameter is missing and token file exists', function (done) {
      var options = [
        {
          flags: '-c, --client-id <client id>',
          shortFlag: 'c',
          longFlag: 'client-id',
          flagVariableName: 'clientId',
          flagDisplayName: 'client id',
          description: 'The client ID',
          required: true
        }
      ]

      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, true)

      promptStubGet.callsArgWith(1, 'error', {password: ''})

      command.exec(options, function () {
        expect(loggerErrorStub.called).to.equal(true)
        expect(programHelpStub.called).to.equal(true)
        expect(processExitStub.calledWith(1)).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should not log error for optional parameter when required is false', function (done) {
      var options = [
        {
          flags: '-c, --client-id <client id>',
          shortFlag: 'c',
          longFlag: 'client-id',
          flagVariableName: 'clientId',
          flagDisplayName: 'client id',
          description: 'The client ID',
          required: false
        }
      ]

      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, true)

      promptStubGet.callsArgWith(1, 'error', {password: ''})

      command.exec(options, function () {
        expect(loggerErrorStub.called).to.equal(false)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should not log error for optional parameter when required is undefined', function (done) {
      var options = [
        {
          flags: '-c, --client-id <client id>',
          shortFlag: 'c',
          longFlag: 'client-id',
          flagVariableName: 'clientId',
          flagDisplayName: 'client id',
          description: 'The client ID'
        }
      ]

      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, true)

      promptStubGet.callsArgWith(1, 'error', {password: ''})

      command.exec(options, function () {
        expect(loggerErrorStub.called).to.equal(false)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should exit when prompt receives an error from user password input and token file does not exist', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.yields(null, false)

      promptStubGet.callsArgWith(1, 'error', {password: ''})

      command.exec([], function () {
        expect(processExitStub.calledWith(1)).to.equal(true)
        done()
      })
    })
  })
}
)
