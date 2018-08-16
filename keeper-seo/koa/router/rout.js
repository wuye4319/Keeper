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

// static
koa.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})
