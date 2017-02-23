import chalk from 'chalk'

module.exports = {
  success: function (msg) {
    console.log(chalk.bgGreen.bold(`SUCCESS`) + ' ' + chalk.green.bold(msg))
  },
  info: function (msg) {
    console.log(chalk.bgBlue.bold(`INFO`) + ' ' + chalk.blue.bold(msg))
  },
  error: function (msg) {
    console.error(chalk.bgRed.bold(`ERROR`) + ' ' + chalk.red.bold(msg))
  }
}