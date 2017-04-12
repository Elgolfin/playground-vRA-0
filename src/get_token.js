import logger from './lib/logger'
import identity from './lib/identity'
import program from 'commander'
import config from './lib/config'
import https from 'https'
// eslint-disable-next-line
import resources from './lib/resources'
import requests from './lib/requests'
import chalk from 'chalk'

program
  .version('0.0.1')
  .usage('[options]')
  .option('-u, --username <username>', 'The username')
  .option('-h, --hostname <hostname>', 'The hostname of the vRealize REST API endpoint')
  .option('-p, --password <password>', 'The password')
  .option('-t, --tenant <tenant name>', 'The tenant name')
  .option('-r, --request-id <request id>', 'The request ID')
  .parse(process.argv)

let errors = []
let warnings = []
if (!program.username) {
  errors.push('You must provide a username')
}
if (!program.password) {
  errors.push('You must provide a password')
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
config.password = program.password
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
  logger.success(`Token: ${token}`)
})
