/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()
// const launcher = require('../static/launcher')
const StaticFiles = require('../static/static')
let staticFiles = new StaticFiles()
require('./global')

// search
koa.addrouter('/tmallsearch/:key', async (ctx) => {
  let key = ctx.params.key
  await ctrl.filtersearch(ctx, 'tmallsearch', key)
})

// static
koa.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})
