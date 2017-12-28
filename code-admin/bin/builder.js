let basemysql = require('../../../admin/base/mysql')
let koa = require('../koa/index')
// router
require('../../../admin/router/rout')

require('./bdrob')

repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: function () {
    basemysql.endconn()
    koa.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
