import request from 'request'
import config from './config'
import chalk from 'chalk'
// import _ from 'lodash'

module.exports = {
  getAll: getAll,
  showConfig: function () {
    console.log(chalk.blue(config.username))
  }
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

  request(options, function (error, response, body) {
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
      cb(null, JSON.stringify(resources, null, 2))
    } else {
      cb(JSON.stringify(body))
    }
  })
}
