/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()

// buy
koa.addrouter(/^\/count(?:\/|$)/, async (ctx) => {
  await ctrl.count(ctx, 'count')
})
