/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Ctrl = require('./ctrl')
let ctrl = new Ctrl()

// subject
koa.addrouter(/^\/image(?:\/|$)/, async (ctx) => {
  await ctrl.filtermall(ctx, 'image', 'pipe')
})
