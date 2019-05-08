const path = require('path')

const resolve = require('../lib/resolve')
const minimist = resolve.require('minimist')
const Service = resolve.require('@vue/cli-service/lib/Service')
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd())

module.exports = class {
  run(cmd) {
    const rawArgv = [cmd]
    const args = minimist(rawArgv, {
      boolean: [
        // build
        'modern',
        'report',
        'report-json',
        'watch',
        // serve
        'open',
        'copy',
        'https',
        // inspect
        'verbose'
      ]
    })
    const command = args._[0]

    service.run(command, args, rawArgv).catch(err => {
      console.log(err)
      process.exit(1)
    })
  }
}

