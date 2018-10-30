/**
 * Created by nero on 2017/5/22.
 */
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const koaBody = require('koa-body')
// let staticFiles = require('./static')
const Fslog = require('../base/logger')
let logger = new Fslog()

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  let myurl = ctx.url.substr(0, ctx.url.indexOf('http'))
  console.log(`${ctx.method} ${myurl || ctx.url} - ${ms}ms`)
  ctx.response.set('Access-Control-Allow-Origin', 'http://localhost')
  ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
  ctx.response.set('Access-Control-Max-Age', '0')
  ctx.response.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Access-Token,Origin-Host')
  ctx.response.set('Access-Control-Allow-Credentials', 'true')
  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 200
  }
})

app.use(router.routes())
// app.use(staticFiles('/static/', './static'))

// error
app.on('error', function (err, ctx) {
  logger.myconsole('server error', err, ctx)
})
var lis = app.listen(8080)
logger.myconsole('The server 8080 is started!!!')

var server = {
  addrouter: (url, fn) => {
    router.get(url, fn).post(url, koaBody(), fn)
  },
  close: () => {
    lis.close()
  }
}

module.exports = server
