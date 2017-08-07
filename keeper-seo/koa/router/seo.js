/**
 * Created by nero on 2017/6/2.
 */
var koa = require('../index')

// init
koa.addrouter('/:url', async (ctx) => {
  ctx.response.body = '<h1>welcome to nodejs</h1>'
  console.log(ctx.params.url.green)
  console.log(ctx.request.host, ctx.request.hostname)
})
