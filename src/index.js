import chalk from 'chalk'
import identity from './lib/identity'
import program from 'commander'
import config from './lib/config'
import https from 'https'

program
  .version('0.0.1')
  .usage('[options]')
  .option('-u, --username <username>', 'The username')
  .option('-h, --hostname <hostname>', 'The hostname of the vRealize REST API endpoint')
  .option('-p, --password <password>', 'The password')
  .option('-t, --tenant <tenant name>', 'The tenant name')
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
  console.error(chalk.red.bold(`✖ ${errors.length + warnings.length} problems (${errors.length} errors, ${warnings.length} warnings)`))
  errors.forEach(function (error, index) {
    console.error(chalk.red.bold(`    ${index}. ${error}`))
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
    console.error(chalk.red.bold(error))
    process.exit(1)
  }
  console.log(chalk.blue.bold(token))
  console.log(chalk.blue.bold(config.token.id))
})
