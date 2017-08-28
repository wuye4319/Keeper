/**
 * Created by nero on 2017/6/2.
 */
var koa = require('../index')
var mystatic = require('../../lib/base/static')
mystatic = new mystatic()

// init
koa.addrouter(/^\/seo(?:\/|$)/, async (ctx) => {
  let myurl = ctx.url.substr(5)
  myurl = decodeURI(myurl.replace(/%3F/, '?'))
  // console.log(myurl)
  let seach = ctx.request.header['user-agent'] || ''
  let result = await mystatic.staticpage('', decodeURI(myurl), seach)

  if (result) {
    ctx.response.body = result
  } else {
    ctx.response.status = 504
  }
})
