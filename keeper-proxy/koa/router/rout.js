/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Action = require('./action')
let action = new Action()
// const launcher = require('../static/launcher')
const StaticFiles = require('../static/static')
let staticFiles = new StaticFiles()
require('./global')

// subject
koa.addrouter(/^\/image(?:\/|$)/, async (ctx) => {
  await action.getimage(ctx, 'image')
})
// subject
koa.addrouter(/^\/taobao(?:\/|$)/, async (ctx) => {
  await action.getmall(ctx, 'taobao')
})

// static
koa.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})
