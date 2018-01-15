/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()

// buy
koa.addrouter(/^\/buy(?:\/|$)/, async (ctx) => {
  await ctrl.filter(ctx, 'buy', true)
})

// subject
koa.addrouter(/^\/subject(?:\/|$)/, async (ctx) => {
  await ctrl.filter(ctx, 'subject')
})

// subject
koa.addrouter(/^\/subject_cn(?:\/|$)/, async (ctx) => {
  await ctrl.filter(ctx, 'subject_cn')
})

// subject
koa.addrouter(/^\/taobao(?:\/|$)/, async (ctx) => {
  await ctrl.filtermall(ctx, 'taobao')
})