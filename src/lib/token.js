import fs from 'fs'
import extfs from 'extfs'

module.exports = {
  doesVMWareTokenExist: doesVMWareTokenExist,
  saveVMwareToken: saveVMwareToken
}

var VMwareTokenPath = 'VMwareToken'

function doesVMWareTokenExist () {
  if (!fs.existsSync(VMwareTokenPath)) {
    return false
  }

  // check to see if file is empty
  if (extfs.isEmptySync(VMwareTokenPath)) {
    return false
  }

  return true
}

/* istanbul ignore next */
function saveVMwareToken (data) {
  fs.writeFileSync(VMwareTokenPath, data)
}
