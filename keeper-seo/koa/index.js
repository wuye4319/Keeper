/**
 * Created by nero on 2017/5/22.
 */
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')({
  prefix: '/seo'
})
let staticFiles = require('./static')

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  ctx.response.set('Access-Control-Allow-Origin', 'http://www.dev.com:8011')
  ctx.response.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
  ctx.response.set('Access-Control-Max-Age', '0')
  ctx.response.set('Access-Control-Allow-Headers', 'X-Requested-With,X_Requested_With')
  ctx.response.set('Access-Control-Allow-Credentials', 'true')
})

app.use(router.routes())

// error
app.on('error', function (err, ctx) {
  log.error('server error', err, ctx)
})
var lis = app.listen(8080)
console.log('the server is started!!!'.green)

var server = {
  addrouter: (url, fn) => {
    router.get(url, fn).post(url, fn)
  },
  static: () => {
    app.use(staticFiles('/static/', __dirname + '/static'))
  },
  close: () => {
    lis.close()
  }
}

module.exports = server
