/**
 * Created by nero on 2017/6/2.
 */
var koa = require('../index')
var product = require('../sql/product')
var theme = require('../sql/theme')

// init
koa.addrouter('/', async (ctx) => {
  ctx.response.body = '<h1>welcome to nodejs</h1>'
  console.log(ctx.request.host, ctx.request.hostname)
})
// 获取主题列表 theme
koa.addrouter('/wssso/theme/getThemeList/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await theme.getThemeList(kindid)
  ctx.response.body = data
})
// 获取相关主题
koa.addrouter('/wssso/theme/getThemeListByKind/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await theme.getThemeListByKind(kindid)
  ctx.response.body = data
})

// 获取主题内商品列表 pro
koa.addrouter('/wssso/theme/getHotProByTheme/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await product.getProListByTheme(kindid, 0, 5)
  ctx.response.body = data
})
// 获取主题内商品列表
koa.addrouter('/wssso/theme/getProListByTheme/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await product.getProListByTheme(kindid, 5, 100)
  ctx.response.body = data
})
