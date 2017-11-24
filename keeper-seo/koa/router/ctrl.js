/**
 * Created by nero on 2017/6/2.
 */
const koa = require('../index')

const Proxy = require('../../lib/proxy')
let proxy = new Proxy()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()

const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const path = require('path')

let internumb = 0
let urlbox = []

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

const filtermall = async (ctx, rout) => {
  // filter
  let myurl = ctx.url.substr(rout.length + 2)
  let search = ctx.request.header['user-agent'] || ''
  console.log('process : '.red + internumb.toString().red)
  console.log(myurl)
  let result

  if (internumb > 9) {
    console.log('Server is busy,please wait...')
    proxy.close()
    console.log('System will restart at 10 seconds later...')
    await delay.delay(10, true)
    proxy.init()
  } else {
    // do not cache url
    internumb += 1
    let hasurl = eachurl(urlbox, myurl)
    if (hasurl) {
      console.log('Repeat request!'.red)
    } else {
      urlbox.push(myurl)
      // read cache file time
      let rct = Date.now()
      let hascache = await cache.readcache(myurl, search, rout)
      rct = Date.now() - rct
      console.log('read cache time : '.green + rct.toString().red + ' ms'.green)
      if (hascache) {
        result = hascache
        console.log('this is cache file!')
      } else {
        result = await proxy.taobao(rout, myurl)
      }

      // rm url in box
      urlbox.splice(hasurl - 1, 1)
      console.log(urlbox)
    }

    internumb -= 1
  }

  if (result) {
    ctx.response.body = result
  } else {
    ctx.response.body = 'Get data failed!'
  }
}

function eachurl (box, url) {
  let result = false
  for (let i in box) {
    if (box[i] === url) result = i + 1
  }
  return result
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
    let hascache = await cache.readcache(myurl, search, rout)
    rct = Date.now() - rct
    console.log('read cache time : '.green + rct.toString().red + ' ms'.green)
    if (hascache) {
      result = hascache
      console.log('this is cache file!')
    } else {
      result = await proxy.seo(rout, myurl, search, title)
    }
    internumb -= 1
  }

  if (!result) {
    let errorfile = path.join(__dirname, '/../../tpl/error/error.html')
    result = fs.readFileSync(errorfile).toString()
  }
  ctx.response.body = result
}
