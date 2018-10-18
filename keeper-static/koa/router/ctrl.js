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
// const path = require('path')

let internumb = 0
let urlbox = []

class ctrl {
  async filter (myurl, rout, type) {
    // filter
    logger.myconsole('process : '.red + internumb.toString().red)
    logger.myconsole(myurl)
    // web log
    logger.myconsole('<p style="color: red">process : ' + internumb + '</p>', 'web')
    logger.myconsole('<p>' + myurl + '</p>', 'web')
    let result

    if (internumb > 15) {
      logger.myconsole('Server is busy,please wait...')
      await proxy.close()
      await proxy.init()
      await proxy.initproxybrowser()
      // clear process and url box
      this.clearinternumb()
      // await proxy.autoproxy()
    } else {
      // do not cache url
      internumb += 1
      let hasurl = this.eachurl(urlbox, myurl)
      if (hasurl) {
        logger.myconsole('Repeat request!'.red)
        logger.myconsole('<p style="color: red">Repeat request!</p>', 'web')
      } else {
        urlbox.push(myurl)
        // read cache file time
        let rct = Date.now()
        let hascache = await cache.readcache(myurl, rout)
        rct = Date.now() - rct
        logger.myconsole('read cache time : '.green + rct.toString().red +
          ' ms'.green)
        logger.myconsole('<p style="color: green">read cache time : <span style="color: red">' + rct.toString() +
          '</span> ms</p>', 'web')
        if (hascache) {
          result = hascache
          logger.myconsole('this is cache file!')
          logger.myconsole('<p>this is cache file!</p>', 'web')
        } else {
          if (type === 'search') {
            result = await proxy.search(rout, myurl, internumb)
          } else {
            result = await proxy.taobao(rout, myurl, internumb)
          }
        }

        // rm url in box
        urlbox.splice(hasurl - 1, 1)
        urlbox.length
          ? logger.myconsole(JSON.stringify(urlbox))
          : logger.myconsole('[]')
        urlbox.length
          ? logger.myconsole('<p>' + JSON.stringify(urlbox) + '</p>', 'web')
          : logger.myconsole('<p>[]</p>', 'web')
      }

      internumb -= 1
    }

    return result
  }

  async filtermall (ctx, rout) {
    let myurl = ctx.url.substr(rout.length + 2)
    let result = await this.filter(myurl, rout)
    if (result) {
      ctx.response.body = result
    } else {
      ctx.response.body = 'Get data failed!'
    }
  }

  async slidelock (ctx, rout) {
    let myurl = ctx.url.substr(rout.length + 2)
    let result = await proxy.autoslide(myurl)
    if (result) {
      ctx.response.body = result
    } else {
      ctx.response.body = 'Get data failed!'
    }
  }

  async filtersearch (ctx, rout, key) {
    // let myurl = 'https://pub.alimama.com/items/search.json?' + key
    let myurl = 'https://s.taobao.com/search?ajax=true&app=mainsrp&q=' + key
    let result = await this.filter(myurl, rout, 'search')
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

  /**
   * proxy ctrl
   * 0 close, 1 open, 2 changeip, 3 auto proxy, 4 manual chang ip
   */
  async ctrlproxy (ctx, type) {
    switch (type) {
      case '0':
        proxy.closeproxy()
        break
      case '1':
        proxy.openproxy()
        break
      case '2':
        await proxy.manualchangeip()
        break
    }

    ctx.response.body = 'success'
  }

  /**
   * auto proxy
   * 0 close, 1 open
   */
  async autoproxy (ctx, type) {
    switch (type) {
      case '0':
        proxy.manualchangeip()
        break
      case '1':
        proxy.autoproxy()
        break
    }

    ctx.response.body = 'success'
  }

  nextbrowser (ctx) {
    proxy.changebrowser()
    ctx.response.body = 'success'
  }

  // login
  async loginbycode (ctx, browsertype, index) {
    if (browsertype) {
      let result = await proxy.loginbycode(browsertype, index)
      let rand = Math.ceil(Math.random() * 1000000000)
      if (result) {
        ctx.response.body = 'codeimg' + browsertype + (index || '') + '.png'
      } else {
        ctx.response.body = 'error'
      }
    } else {
      ctx.response.body = 'Please choose browser, use key [self] or [curr]'
    }
  }

  async loginstatus (ctx, browser) {
    let rand = Math.ceil(Math.random() * 1000000000)
    browser = browser || ''
    let imgpath = './static/source/img/warmachine/codeimg/loginstatus' + browser + '.png'
    let status = fs.statSync(imgpath)
    let labimg = '<img src="/source/img/warmachine/codeimg/loginstatus' + browser + '.png?' + rand + '" />'
    let labp = '<p>' + status.mtime + '</p>'
    ctx.response.body = labimg + labp
  }

  async weblogger (ctx) {
    // let startdate = logger.startdate()
    let logname = logger.getweblog()
    let fslog = './weblog/' + logname + '.txt'
    // fs.watchFile(fslog, (curr, prev) => {
    let txt = fs.readFileSync(fslog).toString()
    // console.log(`the current mtime is: ${curr.mtime}`)
    // console.log(`the previous mtime was: ${prev.mtime}`)
    // })
    ctx.response.body = txt
  }

  // async filter (ctx, rout, title) {
  //   // filter
  //   let myurl = ctx.url.substr(rout.length + 2)
  //   let search = ctx.request.header['user-agent'] || ''
  //   console.log('process : '.red +
  //     internumb.toString().red, ' | search : '.green + search.yellow)
  //   console.log(myurl)
  //
  //   let result
  //   if (internumb > 5) {
  //     console.log('Server is busy,please wait...')
  //   } else {
  //     // do not cache url
  //     internumb += 1
  //     // read cache file time
  //     let rct = Date.now()
  //     let hascache = await cache.readcache(myurl, search, rout)
  //     rct = Date.now() - rct
  //     console.log('read cache time : '.green + rct.toString().red + ' ms'.green)
  //     if (hascache) {
  //       result = hascache
  //       console.log('this is cache file!')
  //     } else {
  //       result = await proxy.seo(rout, myurl, search, title)
  //     }
  //     internumb -= 1
  //   }
  //
  //   if (!result) {
  //     let errorfile = path.join(__dirname, '/../../tpl/error/error.html')
  //     result = fs.readFileSync(errorfile).toString()
  //   }
  //   ctx.response.body = result
  // }
}

module.exports = ctrl
