/**
 * Created by nero on 2017/5/22.
 */
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const koaBody = require('koa-body')
// let staticFiles = require('./static')
const Logger = require('keeper-core')
let logger = new Logger()

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  let myurl = ctx.url.substr(0, ctx.url.indexOf('http'))
  logger.myconsole(`${ctx.method} ${myurl || ctx.url} - ${ms}ms`)
  ctx.response.set('Access-Control-Allow-Origin', 'http://builder.test.com')
  ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
  ctx.response.set('Access-Control-Max-Age', '0')
  ctx.response.set('Access-Control-Allow-Headers', 'X-Requested-With,X_Requested_With,Content-Type')
  ctx.response.set('Access-Control-Allow-Credentials', 'true')
  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 200
  }
})

app.use(router.routes())
// app.use(staticFiles('/static/', './static'))

// error
app.on('error', function (err, ctx) {
  console.log('server error', err, ctx)
})
var lis = app.listen(8080)
console.log('The server is started!!!'.green)
// console.log('http://localhost:8080/builder/test/')
// console.log('http://localhost:8080/wrapper/')
// console.log('http://localhost:8080/create/shop/')

var server = {
  addrouter: (url, fn) => {
    router.get(url, fn).post(url, koaBody(), fn)
  },
  close: () => {
    lis.close()
  }
}

module.exports = server
