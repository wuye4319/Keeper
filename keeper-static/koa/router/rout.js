/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()
const launcher = require('../static/launcher')
const StaticFiles = require('../static/static')
let staticFiles = new StaticFiles()
require('./global')

// order
koa.addrouter(/order/, async (ctx) => {
  let body = ctx.request.body
  console.log(body)
  await ctrl.filtermall(ctx, 'order')
})
koa.addrouter(/^\/slidelock(?:\/|$)/, async (ctx) => {
  await ctrl.slidelock(ctx, 'slidelock')
})

// static
launcher.addrouter(/^\/(\w+)(?:|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})

class rout {
  close () {
    koa.close()
    launcher.close()
  }
}

module.exports = rout