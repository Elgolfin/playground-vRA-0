import logger from '../logger'
import program from 'commander'
import config from '../config'
import https from 'https'
// eslint-disable-next-line
import resources from '../resources'
import prompt from 'prompt'
import fs from 'fs'
import extfs from 'extfs'

module.exports = {
  exec: exec
}

var VMwareTokenPath = 'VMwareToken'

function exec (options, callback) {
  var schema = {
    properties: {
      password: {
        hidden: true,
        required: true
      }
    }
  }

  prompt.start()

  if (doesVMWareTokenExist()) {
    // do not save, continue
    populatePromptOptions(prompt, options, null, callback)
  } else {
    // save and continue
    saveVMwareToken(config.token || 'test')

    prompt.get(schema, function execute (err, promptArg) {
      if (err) {
        logger.error(err)
        process.exit(1)
      }

      populatePromptOptions(prompt, options, promptArg, callback)
    })
  }
}

function populatePromptOptions (prompt, options, promptArg, callback) {
  program
    .version('0.0.1')
    .usage('[options]')
    .option('-u, --username <username>', 'The username')
    .option('-h, --hostname <hostname>', 'The hostname of the vRealize REST API endpoint')
    .option('-t, --tenant <tenant name>', 'The tenant name')

  options.forEach(function (option) {
    program.option(`-${option.shortFlag}, --${option.longFlag} <${option.flagDisplayName}>`, option.description)
  })

  program.parse(process.argv)

  handleProgramArgs(options, program)
  setConfig(program, promptArg)

  callback()
}

function doesVMWareTokenExist () {
  if (!fs.existsSync(VMwareTokenPath)) {
    return false
  }

  // check to see if file is empty
  if (extfs.isEmptySync(VMwareTokenPath)) {
    console.log('Token file is empty')
    return false
  }

  return true
}

function saveVMwareToken (data) {
  fs.writeFileSync(VMwareTokenPath, data)
}

function handleProgramArgs (options, prog) {
  let errors = []
  let warnings = []
  if (!program.username) {
    errors.push('You must provide a username')
  }
  if (!program.hostname) {
    errors.push('You must provide a hostname')
  }
  if (!program.tenant) {
    errors.push('You must provide a tenant')
  }

  options.forEach(function (option) {
    if (typeof option.required !== 'undefined' && option.required && !prog[option.flagVariableName]) {
      errors.push(`You must provide a ${option.flagDisplayName}`)
    }
  })

  if (errors.length > 0) {
    logger.error(`✖ ${errors.length + warnings.length} problems (${errors.length} errors, ${warnings.length} warnings)`)
    errors.forEach(function (error, index) {
      logger.error(`    ${index}. ${error}`)
    })
    program.help()
    process.exit(1)
  }
}

function setConfig (program, promptArg) {
  if (promptArg) {
    config.password = promptArg.password
  }
  config.username = program.username
  config.hostname = program.hostname
  config.tenant = program.tenant
  config.agent = new https.Agent({
    host: config.hostname,
    port: '443',
    path: '/',
    rejectUnauthorized: false
  })
}
