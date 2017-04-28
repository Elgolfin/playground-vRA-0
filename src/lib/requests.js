import request from 'request'
import config from './config'
import chalk from 'chalk'
import _ from 'lodash'

  /* istanbul ignore next */
module.exports = {
  getAll: getAll,
  getByName: getByName,
  submit: submit,
  showConfig: function () {
    console.log(chalk.blue(config.username))
  },
  getObjectFromKey: getObjectFromKey,
  get: get,
  getAllCatalogItems: getAllCatalogItems,
  getTemplate: getTemplate,
  sendRequest: sendRequest
}

function getAllCatalogItems (cb) {
  var options = {
    method: 'GET',
    agent: config.agent,
    url: `https://${config.hostname}/catalog-service/api/consumer/entitledCatalogItemViews?limit=1000`,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'authorization': `Bearer ${config.token.id}`
    },
    body: {},
    json: true
  }

  request.get(options, function (error, response, body) {
    if (error) {
      cb(error)
    }

    if (response.statusCode === 200) {
      let items = []
      body.content.forEach(function (item) {
        var res = {}
        res.name = item.name
        res.id = item.catalogItemId
        res.submitRequestUrl = item.links[1].href
        res.submitRequestUrlMethod = item.links[1].rel
        // res.catalogResourceLabel = item.catalogResource.label
        // res.catalogResourceId = item.catalogResource.id
        items.push(res)
      }, this)
      cb(null, JSON.stringify(items, null, 2))
    } else {
      cb(JSON.stringify(body))
    }
  })
}

function getByName (name, cb) {
  var options = {
    method: 'GET',
    agent: config.agent,
    url: `https://${config.hostname}/catalog-service/api/consumer/entitledCatalogItemViews?limit=1000&$filter=(name eq '${name}')`,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'authorization': `Bearer ${config.token.id}`
    },
    body: {},
    json: true
  }

  request.get(options, function (error, response, body) {
    if (error) {
      return cb(error)
    }

    if (response.statusCode === 200) {
      cb(null, body.content[0])
    } else {
      cb(JSON.stringify(body, null, 2))
    }
  })
}

function submit (deploymentOptions, cb) {
  module.exports.getByName(deploymentOptions.blueprintName, function (error, response) {
    if (error) {
      console.error('getByName')
      return cb(error)
    }

    var urlTemplate = response.links[0].href
    var urlRequest = response.links[1].href

    module.exports.getTemplate(urlTemplate, function (error, templateData) {
      if (error) {
        console.error('getTemplate')
        return cb(error)
      }

      var sshKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC/ouV9PGZ1+SZJBLYxJtXDSxP4aaJCS/RSgm6jLBnD/llyDTLXQwk/7j7NfX2BTdTfwtEDDCHgKLokPreu0f2jgzL6LC3psJQaGXu3B0/u81oXthbVgN+EagOyP6u9HgiDJXFRmmDKCq0hADO98p5pUJlTa6z9GR2pYGaXGOHkXHV6M38vHSwJZ3i0EBcwPqfYK78MO/NAwoAzbiWhn8En24BiJe+gsvspl/2Cpi0uNENG5UkGOHS572pJ98ZiyxUCu4UmMP7CviDys2no7dVpgLyVsrT9Nq3+8FBarhAFFszKa0ucIALuGrLxREl81QxSv4Mjr+LMtcjE8JpmydQ/HtLDWkK1arFsyBNu2PcClYdwmHsabOdV0ssQCAeU74QHdA8Du3oakRHrnwinzVG9gmV5j1JicjUmqczVypXdC4oYlU+UiaIvs7W4mTfgpfzz08ahVDAQPDwWsDPQlg76P/nLapQqa+rydrGheGpporEIEZoPv9pxS4s4izVdZQvNafpCjl4/oXFNwgdgJGUoQq0Zu0F/pn8Mikil/0e4/6HF7O/og2/n0Rx1bX2IPMjx5Jh066yrLFO8Wiq0a8CUZjwHSQx6XjRQaPCdjPE3pol1xjPZffNutu8ZWH+wT88VMKiyufzkd/sdYWSzjKeM2PhANhkhZZWRpkr3g63whw=='
      templateData.data['hybris.Hostname.CID'] = deploymentOptions.clientId + Date.now()
      templateData.data['hybris.Hostname.PID'] = deploymentOptions.projectId
      var deploymentName = deploymentOptions.deploymentName + Date.now()
      templateData.data['_deploymentName'] = deploymentName
      templateData.data.JUMPBOX.data['hybris.SSH.ssh_key'] = sshKey
      templateData.data['hybris.SSH.ssh_key'] = sshKey
      templateData.description = deploymentName

      module.exports.sendRequest(urlRequest, templateData, function (error, response) {
        if (error) {
          console.error('sendRequest')
          return cb(error)
        }
        cb(null, response)
      })
    })
  })
}

function getTemplate (url, cb) {
  var options = {
    method: 'GET',
    agent: config.agent,
    url: url,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'authorization': `Bearer ${config.token.id}`
    },
    body: {},
    json: true
  }

  request.get(options, function (error, response, body) {
    if (error) {
      return cb(error)
    }

    if (response.statusCode === 200) {
      cb(null, body)
    } else {
      cb(JSON.stringify(body, null, 2))
    }
  })
}

function sendRequest (url, data, cb) {
  var options = {
    method: 'POST',
    agent: config.agent,
    url: url,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'authorization': `Bearer ${config.token.id}`
    },
    body: data,
    json: true
  }

  request.post(options, function (error, response, body) {
    if (error) {
      return cb(error)
    }
    if (response.statusCode === 201) {
      cb(null, body)
    } else {
      cb(body)
    }
  })
}

function get (params, cb) {
  var options = {
    method: 'GET',
    agent: config.agent,
    url: `https://${config.hostname}/catalog-service/api/consumer/requests/${params.id}`,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'authorization': `Bearer ${config.token.id}`
    },
    json: true
  }

  request.get(options, function (error, response, body) {
    if (error) {
      return cb(error)
    }
    if (response.statusCode === 200) {
      var result = body
      if (params.raw === false) {
        result = {
          id: body.id,
          requestCompletion: body.requestCompletion
        }
      }
      cb(null, result)
    } else {
      cb(body)
    }
  })
}

function getAll (obj, cb) {
  var options = {
    method: 'GET',
    agent: config.agent,
    url: `https://${config.hostname}/catalog-service/api/consumer/requests/`,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'authorization': `Bearer ${config.token.id}`
    },
    json: true
  }

  request.get(options, function (error, response, body) {
    if (error) {
      return cb(error)
    }
    if (response.statusCode === 200) {
      cb(null, body)
    } else {
      cb(body)
    }
  })
}

function getObjectFromKey (jsonObject, key) {
  var indexCID = _.findIndex(jsonObject.entries, function (o) {
    return o.key === key
  })
  // 'key', 'hybris.Hostname.CID')
  if (indexCID === -1) {
    return null
  }
  return jsonObject.entries[indexCID]
}
