/**
 * Created by nero on 2017/5/22.
 */
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
// let staticFiles = require('./static')
const Logger = require('keeper-core')
let logger = new Logger()

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  let myurl = ctx.url.substr(0, ctx.url.indexOf('http'))
  logger.myconsole(`${ctx.method} ${myurl || ctx.url} - ${ms}ms`)
  ctx.response.set('Access-Control-Allow-Origin', 'http://localhost:8080')
  ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
  ctx.response.set('Access-Control-Max-Age', '0')
  ctx.response.set('Access-Control-Allow-Headers', 'X-Requested-With,X_Requested_With')
  ctx.response.set('Access-Control-Allow-Credentials', 'true')
})

app.use(router.routes()).use(router.allowedMethods())
// app.use(staticFiles('/static/', __dirname + '/../static'))

// error
app.on('error', function (err, ctx) {
  console.log('server error', err, ctx)
})
let lis = app.listen(8080)
console.log('the server is started!!!'.green)

let server = {
  addrouter: (url, fn) => {
    router.get(url, fn).post(url, fn)
  },
  close: () => {
    lis.close()
  }
}

module.exports = server
