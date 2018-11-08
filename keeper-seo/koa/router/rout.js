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

// buy
koa.addrouter(/^\/buy(?:\/|$)/, async (ctx) => {
  await ctrl.filter(ctx, 'buy', true)
})
koa.addrouter(/^\/subject(?:\/|$)/, async (ctx) => {
  await ctrl.filter(ctx, 'subject')
})
koa.addrouter(/^\/subject_cn(?:\/|$)/, async (ctx) => {
  await ctrl.filter(ctx, 'subject_cn')
})
koa.addrouter(/^\/taobao(?:\/|$)/, async (ctx) => {
  await ctrl.filtermall(ctx, 'taobao')
})
koa.addrouter(/^\/slidelock(?:\/|$)/, async (ctx) => {
  await ctrl.slidelock(ctx, 'slidelock')
})

// change region
koa.addrouter('/getstate/:type/:index', async (ctx) => {
  let type = ctx.params.type
  let index = ctx.params.index
  await ctrl.getstate(ctx, 'state', type, index)
})

// search
koa.addrouter('/search/:key', async (ctx) => {
  let key = ctx.params.key
  await ctrl.filtersearch(ctx, 'search', key)
})

// static
koa.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})
