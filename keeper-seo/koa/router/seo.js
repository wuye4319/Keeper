/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Mystatic = require('../../lib/base/static')
const mystatic = new Mystatic()
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()

let internumb = 0

// buy
koa.addrouter(/^\/sbuy(?:\/|$)/, async (ctx) => {
  await filter(ctx, 'sbuy', true)
})

// subject
koa.addrouter(/^\/subject(?:\/|$)/, async (ctx) => {
  await filter(ctx, 'subject')
})

const filter = async (ctx, rout, title) => {
  // filter
  let myurl = ctx.url.substr(rout.length + 2)
  let search = ctx.request.header['user-agent'] || ''
  console.log('process : '.red + internumb.toString().red)
  console.log(myurl)

  let result
  if (internumb > 5) {
    console.log('Server is busy,please wait...')
  } else {
    internumb += 1
    let hascache = cache.readcache(myurl, search)
    if (hascache) {
      result = hascache
      console.log('this is cache file!')
    } else {
      result = await mystatic.staticpage(rout, myurl, search, title)
    }
    internumb -= 1
  }

  if (result) {
    ctx.response.body = result
  } else {
    ctx.response.status = 504
  }
}
