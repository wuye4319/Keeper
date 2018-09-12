/**
 * Created by nero on 2017/6/2.
 */
const Proxy = require('keeper-proxy')
let koa = new Proxy()
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()
const Machine = require('./machine')
let machine = new Machine()
machine.init()

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
koa.addrouter('/proxy/:status/', async (ctx) => {
  let params = ctx.params.status
  await ctrl.ctrlproxy(ctx, params)
})
koa.addrouter('/autoproxy/:status/', async (ctx) => {
  let params = ctx.params.status
  await ctrl.autoproxy(ctx, params)
})
koa.addrouter('/browser/next/', async (ctx) => {
  await ctrl.nextbrowser(ctx)
})
