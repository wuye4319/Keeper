/**
 * Created by nero on 2017/6/2.
 */
var koa = require('../index')
var product = require('../service/product')
var theme = require('../service/theme')

// init
koa.addrouter('/', async (ctx) => {
  ctx.response.body = '<h1>welcome to nodejs</h1>'
  console.log(ctx.request.host, ctx.request.hostname)
})
// 获取主题列表 theme
koa.addrouter('/theme/getThemeList/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await theme.getThemeList(kindid)
  ctx.response.body = data
})
// 获取相关主题
koa.addrouter('/theme/getThemeListByKind/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await theme.getThemeListByKind(kindid)
  ctx.response.body = data
})

// 获取主题内商品列表 pro
koa.addrouter('/theme/getHotProByTheme/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await product.getProListByTheme(kindid, 0, 5)
  ctx.response.body = data
})
// 获取主题内商品列表
koa.addrouter('/theme/getProListByTheme/:id', async (ctx) => {
  var kindid = ctx.params.id
  var data = await product.getProListByTheme(kindid, 5, 100)
  ctx.response.body = data
})
