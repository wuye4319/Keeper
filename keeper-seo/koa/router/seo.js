/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')
const Mystatic = require('../../lib/static-seo')
const mystatic = new Mystatic()

const TmallMystatic = require('../../lib/static')
const tmallmystatic = new TmallMystatic()

const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const path = require('path')

let internumb = 0

// buy
koa.addrouter(/^\/buy(?:\/|$)/, async (ctx) => {
  await filter(ctx, 'buy', true)
})

// subject
koa.addrouter(/^\/subject(?:\/|$)/, async (ctx) => {
  await filter(ctx, 'subject')
})

// subject
koa.addrouter(/^\/subject_cn(?:\/|$)/, async (ctx) => {
  await filter(ctx, 'subject_cn')
})

// subject
koa.addrouter(/^\/taobao(?:\/|$)/, async (ctx) => {
  await filtermall(ctx, 'taobao')
})

const filtermall = async (ctx, rout, title) => {
  // filter
  let myurl = ctx.url.substr(rout.length + 2)
  console.log('process : '.red + internumb.toString().red)
  console.log(myurl)

  if (internumb > 5) {
    console.log('Server is busy,please wait...')
  } else {
    // do not cache url
    internumb += 1
    let mallresult = await tmallmystatic.staticpage(rout, myurl, title)
    ctx.response.body = mallresult
    internumb -= 1
  }
}

const filter = async (ctx, rout, title) => {
  // filter
  let myurl = ctx.url.substr(rout.length + 2)
  let search = ctx.request.header['user-agent'] || ''
  console.log('process : '.red + internumb.toString().red, ' | search : '.green + search.yellow)
  console.log(myurl)

  let result
  if (internumb > 5) {
    console.log('Server is busy,please wait...')
  } else {
    // do not cache url
    internumb += 1
    // read cache file time
    let rct = Date.now()
    let hascache = cache.readcache(myurl, search, rout)
    rct = Date.now() - rct
    console.log('read cache time : '.green + rct.toString().red + ' ms'.green)
    if (hascache) {
      result = hascache
      console.log('this is cache file!')
    } else {
      result = await mystatic.staticpage(rout, myurl, search, title)
    }
    internumb -= 1
  }

  if (!result) {
    let errorfile = path.join(__dirname, '/../../tpl/error/error.html')
    result = fs.readFileSync(errorfile).toString()
  }
  ctx.response.body = result
}
