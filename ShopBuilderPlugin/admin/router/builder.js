/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../../koa/index')
const fs = require('fs')
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Builder = require('../service/builder')
let builder = new Builder()

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
