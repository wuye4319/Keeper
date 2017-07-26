/**
 * Created by nero on 2017/3/23.
 */
var fsvers = require('../rules/version')
var rulvers = new fsvers()

class myvers {
    // version of rules.js, not config.js
  vers () {
    var version = rulvers.version().version
    console.log('version:'.green + version.green)
  }

  checkconf () {
    var result = rulvers.checkconf()
    return result
  }
}

module.exports = myvers
