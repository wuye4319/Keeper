/**
 * Created by nero on 2017/6/2.
 */
const server = require('./index')
const launcher = require('../static/launcher')
const StaticFiles = require('../static/static')
let staticFiles = new StaticFiles()

// static
launcher.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})

class rout {
  serverlisten(port) {
    return server.listen(port)
  }

  staticlisten() {
    return launcher.listen()
  }

  addrouter(rule, fn) {
    server.addrouter(rule, fn)
  }

  logger() { 
    server.logger()
  }

  close() {
    this.serverlistem.close()
    this.staticlisten.close()
  }
}

module.exports = rout