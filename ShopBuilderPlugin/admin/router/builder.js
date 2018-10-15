/**
 * Created by nero on 2017/6/2.
 */
const koa = require('shop-builder/koa/index')
const fs = require('fs')
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Builder = require('../service/builder')
let builder = new Builder()

let globparam = '/web/v1/'
// init
koa.addrouter('/', async (ctx) => {
  ctx.response.body = '<h1>welcome to nodejs</h1>'
  console.log(ctx.request.host, ctx.request.hostname)
})
koa.addrouter('/shopbuilder/userpageconfig/:type/:user', async (ctx) => {
  let user = ctx.params.user
  let type = ctx.params.type
  let body = ctx.request.body
  let result
  switch (type) {
    case 'get':
      result = builder.getpageconfig(user)
      break
    case 'edit':
      result = builder.editpageconfig(user, body)
      break
  }
  ctx.response.body = result
})
koa.addrouter(globparam + 'collections', async (ctx) => {
  let result
  result = builder.collections()
  ctx.response.body = result
})
koa.addrouter(globparam + 'collections/multiple', async (ctx) => {
  let result
  result = builder.collectionsmul()
  ctx.response.body = result
})
koa.addrouter(globparam + 'collections/:id', async (ctx) => {
  let id = ctx.params.id
  let result
  result = builder.collectionsdetail(id)
  ctx.response.body = result
})
koa.addrouter(globparam + 'products', async (ctx) => {
  let result
  result = builder.products()
  ctx.response.body = result
})
koa.addrouter(globparam + 'products/:id', async (ctx) => {
  let id = ctx.params.id
  let result
  result = builder.productsdetail(id)
  ctx.response.body = result
})
koa.addrouter(globparam + 'blog', async (ctx) => {
  let result
  result = builder.blog()
  ctx.response.body = result
})
koa.addrouter(globparam + 'blog/:id', async (ctx) => {
  let id = ctx.params.id
  let result
  result = builder.blogdetail(id)
  ctx.response.body = result
})