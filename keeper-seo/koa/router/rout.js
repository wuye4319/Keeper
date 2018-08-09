/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()
// const launcher = require('../static/launcher')
const StaticFiles = require('../static/static')
let staticFiles = new StaticFiles()
const Machine = require('./machine')
let machine = new Machine()
machine.init()

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

// logincode
koa.addrouter('/logincode/:browser/:index', async (ctx) => {
  let browser = ctx.params.browser
  let index = ctx.params.index
  await ctrl.loginbycode(ctx, browser, index)
})
koa.addrouter('/logincode/:browser/', async (ctx) => {
  let browser = ctx.params.browser
  await ctrl.loginbycode(ctx, browser)
})
koa.addrouter('/loginstatus/:browser', async (ctx) => {
  let browser = ctx.params.browser
  await ctrl.loginstatus(ctx, browser)
})

// logincode
koa.addrouter('/apidata/machine', async (ctx) => {
  let data = await machine.getdata()
  ctx.response.body = data
})

// web log
koa.addrouter('/logger/', async (ctx) => {
  await ctrl.weblogger(ctx)
})

// proxy
koa.addrouter('/proxy/close/', async (ctx) => {
  await ctrl.closeproxy(ctx)
})
koa.addrouter('/proxy/open/', async (ctx) => {
  await ctrl.openproxy(ctx)
})
koa.addrouter('/proxy/next/', async (ctx) => {
  await ctrl.nextproxy(ctx)
})
koa.addrouter('/browser/next/', async (ctx) => {
  await ctrl.nextbrowser(ctx)
})

// static
koa.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})
