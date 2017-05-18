import request from 'request'
import config from './config'
import chalk from 'chalk'
import fs from 'fs'
// import _ from 'lodash'

module.exports = {
  getAll: getAll,
  importAction: importAction,
  showConfig: function () {
    console.log(chalk.blue(config.username))
  }
}

function importAction (categoryName, actionPath, cb) {
  var options = {
    method: 'POST',
    agent: config.agent,
    url: `https://${config.hostname}/vco/api/actions/`,
    headers: {
      'cache-control': 'no-cache',
      'authorization': 'Basic ' + new Buffer(config.username + ':' + config.password).toString('base64')
    },
    body: {},
    qs: {categoryName: categoryName},
    json: true,
    formData: {file: fs.createReadStream(actionPath)}
  }

  request.post(options, function (error, response, body) {
    if (error) {
      cb(error)
    }

    console.log('BODY: ' + body.content[0])

    if (response.statusCode === 200) {
      cb(null, body.content[0])
    } else {
      cb(JSON.stringify(body))
    }
  })
}

function getAll (cb) {
  var options = {
    method: 'GET',
    agent: config.agent,
    url: `https://${config.hostname}/catalog-service/api/consumer/resources?limit=1000`,
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
      let resources = []
      body.content.forEach(function (resource) {
        var res = {}
        res.name = resource.name
        res.status = resource.status
        res.id = resource.id
        res.typeRef = resource.resourceTypeRef.label
        // res.catalogResourceLabel = resource.catalogResource.label
        // res.catalogResourceId = resource.catalogResource.id
        resources.push(res)
      }, this)
      cb(null, body.content[0])
    } else {
      cb(JSON.stringify(body))
    }
  })
}
