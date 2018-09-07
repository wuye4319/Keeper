const koa = require('../koa/index')
const stat = require('../koa/static/launcher')
require('../koa/router/rout')

repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: async function () {
    // koa,do not merge to proxy!
    koa.close()
    stat.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
