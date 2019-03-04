/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const launcher = require('../static/launcher')
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()
const StaticFiles = require('../static/static')
let staticFiles = new StaticFiles()
require('../../admin/base/rout')

class rout {
  closeall () {
    koa.close()
    launcher.close()
  }
}

// buy
koa.addrouter(/^\/builder(?:\/|$)/, async (ctx) => {
  await ctrl.filter(ctx, 'builder', true)
})
koa.addrouter('/wrapper/', async (ctx) => {
  await ctrl.wrap()
})
koa.addrouter('/createshop/:user', async (ctx) => {
  let user = ctx.params.user
  await ctrl.filter(ctx, 'createshop', user)
})

// static
launcher.addrouter(/^\/builder(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '', './static/')
})
// static
launcher.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '', './static/theme')
})

module.exports = rout