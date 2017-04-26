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

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    promptStubStart = sandbox.stub(prompt, 'start')
    promptStubGet = sandbox.stub(prompt, 'get')
    programParse = sandbox.stub(program, 'parse')
    tokenExistsStub = sandbox.stub(token, 'doesVMWareTokenExist')
    programHelpStub = sandbox.stub(program, 'help')
    loggerErrorStub = sandbox.stub(logger, 'error')
    processExitStub = sandbox.stub(process, 'exit')
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('exec method', function () {
    it('callback should properly execute when a token file exists and all parameters have been provided', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.returns(true)

      var callback = sinon.stub()
      command.exec([], callback)

      expect(callback.called).to.equal(true)
      done()
    })
  })

  describe('exec method', function () {
    it('callback should properly execute when a password is entered at the prompt and all parameters have been provided', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.returns(false)

      promptStubGet.callsArgWith(1, null, {password: 'pwd'})

      command.exec([], function () {
        expect(promptStubGet.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for missing tenant parameter when tenant parameter is missing', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = ''
      tokenExistsStub.returns(true)

      command.exec([], function () {
        expect(programHelpStub.callCount).to.equal(1)
        expect(processExitStub.calledWith(1)).to.equal(true)
        expect(loggerErrorStub.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for missing hostname parameter when hostname parameter is missing', function (done) {
      program.username = 'username'
      program.hostname = ''
      program.tenant = 'tenant'
      tokenExistsStub.returns(true)

      command.exec([], function () {
        expect(programHelpStub.callCount).to.equal(1)
        expect(processExitStub.calledWith(1)).to.equal(true)
        expect(loggerErrorStub.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for missing username parameter when username parameter is missing', function (done) {
      program.username = ''
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.returns(true)

      command.exec([], function () {
        expect(programHelpStub.callCount).to.equal(1)
        expect(processExitStub.calledWith(1)).to.equal(true)
        expect(loggerErrorStub.called).to.equal(true)
        done()
      })
    })
  })

  describe('exec method', function () {
    it('should prompt for additional missing parameter when additional parameter is missing', function (done) {
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
      tokenExistsStub.returns(false)

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
    it('should exit when prompt receives an error from user password input', function (done) {
      program.username = 'username'
      program.hostname = 'hostname'
      program.tenant = 'tenant'
      tokenExistsStub.returns(false)

      promptStubGet.callsArgWith(1, 'error', {password: ''})

      command.exec([], function () {
        expect(processExitStub.calledWith(1)).to.equal(true)
        done()
      })
    })
  })
}
)