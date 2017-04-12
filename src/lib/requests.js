import request from 'request'
import config from './config'
import chalk from 'chalk'
import _ from 'lodash'

module.exports = {
  getAll: getAll,
  getByName: getByName,
  submit: submit,
  showConfig: function () {
    console.log(chalk.blue(config.username))
  },
  getObjectFromKey: getObjectFromKey,
  get: get,
  getAllCatalogItems: getAllCatalogItems
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

  request(options, function (error, response, body) {
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

  request(options, function (error, response, body) {
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
  getByName(deploymentOptions.blueprintName, function (error, response) {
    if (error) {
      return cb(error)
    }

    var urlTemplate = response.links[0].href
    var urlRequest = response.links[1].href

    getTemplate(urlTemplate, function (error, templateData) {
      if (error) {
        return cb(error)
      }

      templateData.data['hybris.Hostname.CID'] = deploymentOptions.clientId
      templateData.data['hybris.Hostname.PID'] = deploymentOptions.projectId
      templateData.data['_deploymentName'] = deploymentOptions.deploymentName

      sendRequest(urlRequest, templateData, function (error, response) {
        if (error) {
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

  request(options, function (error, response, body) {
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

  request(options, function (error, response, body) {
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

  request(options, function (error, response, body) {
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

  request(options, function (error, response, body) {
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
