/**
 * Created by nero on 2017/6/2.
 */
const fs = require('fs')
const Proxy = require('../../lib/proxy')
let proxy = new Proxy()
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
      await proxy.close()
      await proxy.init()
      await proxy.initproxybrowser()
      // clear process and url box
      this.clearinternumb()
    } else {
      // do not cache url
      internumb += 1
      let hasurl = this.eachurl(urlbox, myurl)
      if (hasurl) {
        logger.myconsole('Repeat request!'.red)
        // waiting result
      } else {
        urlbox.push(myurl)
        // read cache file time
        let rct = Date.now()
        let hascache = await cache.readcache(myurl, rout)
        rct = Date.now() - rct
        logger.myconsole('read cache time : '.green + rct.toString().red +
          ' ms'.green)
        if (hascache) {
          result = hascache
          logger.myconsole('this is cache file!')
        } else {
          result = await proxy.taobao(rout, myurl, internumb)
        }

        // rm url in box
        urlbox.splice(hasurl - 1, 1)
        urlbox.length
          ? logger.myconsole(JSON.stringify(urlbox))
          : logger.myconsole('[]')
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

  async loginbycode (ctx, browser) {
    if (browser) {
      let result = await proxy.loginbycode(browser)
      let rand = Math.ceil(Math.random() * 1000000000)
      if (result) {
        ctx.response.body = '<img src="/static/codeimg/codeimg.png?' + rand + '" /><p><a href="/loginstatus/">click to check login status</a></p>'
      } else {
        ctx.response.body = 'error'
      }
    } else {
      ctx.response.body = 'Please choose browser, use key [self] or [curr]'
    }
  }

  async loginstatus (ctx) {
    let rand = Math.ceil(Math.random() * 1000000000)
    let imgpath = path.join(__dirname, '/../../static/codeimg/loginstatus.png')
    let status = fs.statSync(imgpath)
    let labimg = '<img src="/static/codeimg/loginstatus.png?' + rand + '" />'
    let labp = '<p>' + status.mtime + '</p>'
    ctx.response.body = labimg + labp
  }

  async weblogger (ctx) {
    let startdate = logger.startdate()
    let fslog = path.join(__dirname, '../../../logger/' + startdate + '.txt')
    fs.watchFile(fslog, (curr, prev) => {
      console.log(`the current mtime is: ${curr.mtime}`)
      console.log(`the previous mtime was: ${prev.mtime}`)
    })
  }

  async filter (ctx, rout, title) {
    // filter
    let myurl = ctx.url.substr(rout.length + 2)
    let search = ctx.request.header['user-agent'] || ''
    console.log('process : '.red +
      internumb.toString().red, ' | search : '.green + search.yellow)
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
