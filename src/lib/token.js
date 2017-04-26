import fs from 'fs'
import extfs from 'extfs'

module.exports = {
  doesVMWareTokenExist: doesVMWareTokenExist,
  saveVMwareToken: saveVMwareToken
}

var VMwareTokenPath = 'VMwareToken'

function doesVMWareTokenExist (cb) {
  fs.exists(VMwareTokenPath, function (exists) {
    if (!exists) {
      return cb(`The file at path ${VMwareTokenPath} does not exist`, false)
    }

    extfs.isEmpty(VMwareTokenPath, function (empty) {
      if (empty) {
        return cb(`The file at path ${VMwareTokenPath} is empty`, false)
      }
      cb(null, true)
    })
  })
}

/* istanbul ignore next */
function saveVMwareToken (data) {
  fs.writeFile(VMwareTokenPath, data, function (err) {
    if (err) {
      throw err
    }
  })
}
