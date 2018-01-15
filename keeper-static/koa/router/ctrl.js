/**
 * Created by nero on 2017/6/2.
 */
const Proxy = require('../../lib/proxy')
let proxy = new Proxy()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()
const Logger = require('keeper-core')
let logger = new Logger()

const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const path = require('path')

let internumb = 0
let urlbox = []

class ctrl {
  async filtermall (ctx, rout) {
    // filter
    let myurl = ctx.url.substr(rout.length + 2)
    logger.myconsole('process : '.red + internumb.toString().red)
    logger.myconsole(myurl)
    let result

    if (internumb > 15) {
      logger.myconsole('Server is busy,please wait...')
      proxy.restart()
      // clear process and url box
      this.clearinternumb()
    } else {
      // do not cache url
      internumb += 1
      let hasurl = this.eachurl(urlbox, myurl)
      if (hasurl) {
        logger.myconsole('Repeat request!'.red)
      } else {
        urlbox.push(myurl)
        // read cache file time
        let rct = Date.now()
        let hascache = await cache.readcache(myurl, rout)
        rct = Date.now() - rct
        logger.myconsole('read cache time : '.green + rct.toString().red + ' ms'.green)
        if (hascache) {
          result = hascache
          logger.myconsole('this is cache file!')
        } else {
          result = await proxy.taobao(rout, myurl)
        }

        // rm url in box
        urlbox.splice(hasurl - 1, 1)
        urlbox.length ? logger.myconsole(JSON.stringify(urlbox)) : logger.myconsole('[]')
      }

      internumb -= 1
    }

    if (result) {
      ctx.response.body = result
    } else {
      ctx.response.body = 'Get data failed!'
    }
  }

  eachurl (box, url) {
    let result = false
    for (let i in box) {
      if (box[i] === url) result = i + 1
    }
    return result
  }

  clearinternumb () {
    internumb = 0
    urlbox = []
  }

  async filter (ctx, rout, title) {
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
}

module.exports = ctrl