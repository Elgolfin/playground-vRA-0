import command from './lib/command'
import logger from './lib/logger'

var options = [
  {
    flags: '-c, --client-id <client id>',
    shortFlag: 'c',
    longFlag: 'client-id',
    flagVariableName: 'clientId',
    flagDisplayName: 'client id',
    description: 'The client ID',
    required: true
  },
  {
    flags: '-i, --project-id <project id>',
    shortFlag: 'i',
    longFlag: 'project-id',
    flagVariableName: 'projectId',
    flagDisplayName: 'project id',
    description: 'The project ID',
    required: true
  },
  {
    flags: '-n, --deployment-name <deployment name>',
    shortFlag: 'n',
    longFlag: 'deployment-name',
    flagVariableName: 'deploymentName',
    flagDisplayName: 'deployment name',
    description: 'The deployment name',
    required: true
  },
  {
    flags: '-z, --test <test>',
    shortFlag: 'z',
    longFlag: 'test',
    flagDisplayName: 'test',
    description: 'Test',
    required: false
  }
]

command.exec(options, function () {
  logger.info('TEST')
})
