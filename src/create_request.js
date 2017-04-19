import logger from './lib/logger'
import identity from './lib/identity'
import program from 'commander'
import config from './lib/config'
import https from 'https'
// eslint-disable-next-line
import resources from './lib/resources'
import requests from './lib/requests'
import chalk from 'chalk'
import prompt from 'prompt'

var schema = {
  properties: {
    password: {
      hidden: true,
      required: true
    }
  }
}

prompt.start()

  //
  // Get two properties from the user: email, password
  //
prompt.get(schema, execute)

function execute (err, result) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  program
  .version('0.0.1')
  .usage('[options]')
  .option('-u, --username <username>', 'The username')
  .option('-h, --hostname <hostname>', 'The hostname of the vRealize REST API endpoint')
  .option('-k, --key <key>', 'The key to decrypt the password')
  .option('-t, --tenant <tenant name>', 'The tenant name')
  .option('-c, --client-id <client id>', 'The client ID')
  .option('-i, --project-id <project id>', 'The project ID')
  .option('-n, --deployment-name <deployment name>', 'The deployment name')
  .parse(process.argv)

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

  if (errors.length > 0) {
    logger.error(`✖ ${errors.length + warnings.length} problems (${errors.length} errors, ${warnings.length} warnings)`)
    errors.forEach(function (error, index) {
      logger.error(`    ${index}. ${error}`)
    })
    process.exit(1)
  }

  config.username = program.username
  config.password = result.password
  config.hostname = program.hostname
  config.tenant = program.tenant
  config.agent = new https.Agent({
    host: config.hostname,
    port: '443',
    path: '/',
    rejectUnauthorized: false
  })

  identity.getToken((error, token) => {
    if (error) {
      logger.error(chalk.red.bold(error))
      process.exit(1)
    }
    logger.success(`Token successfully acquired (user: ${config.username})`)

    var deploymentOptions = {
      blueprintName: 'Project Zone v5.1.0',
      clientId: program.clientId,
      projectId: program.projectId,
      deploymentName: program.deploymentName
    }

    requests.submit(deploymentOptions, (error, response) => {
      if (error) {
        logger.error(JSON.stringify(error, null, 2))
        process.exit(1)
      }
      logger.success('The Request has been sucessfully submitted. Id: ' + response.id)
    // logger.info(JSON.stringify(response, null, 2))

  // requests.getByName('Project Zone v5.1.0', (error, response) => {
  //   if (error) {
  //     logger.error(error)
  //     process.exit(1)
  //   }
  //   logger.info(JSON.stringify(response, null, 2))

  //   requests.submit('Project Zone v5.1.0', (error, response) => {
  //     if (error) {
  //       logger.error(error)
  //       process.exit(1)
  //     }
  //     logger.info(JSON.stringify(response, null, 2))
  //   })
  // })
    })
  })
}
