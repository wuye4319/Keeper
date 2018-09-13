/**
 * Created by nero on 2017/6/2.
 */
const fs = require('fs')
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
const Logger = require('keeper-core')
let logger = new Logger()
const Process = require('./process')
let process = new Process()

class ctrl {
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
        ctx.response.body = '<img src="/source/img/warmachine/codeimg/codeimg' + browsertype + (index || '') + '.png?' + rand +
          '" /><p><a href="/loginstatus/' + browsertype + (index || '') + '/">click to check login status</a></p>'
        // ctx.response.body = 'codeimg' + browsertype + (index || '') + '.png'
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

  async getimg (url, rout) {
    // get data by url
    // http://top.baidu.com/?fr=tph_right
    // http://top.baidu.com/buzz?b=341&c=513&fr=topbuzz_b42_c513
    let url = 'http://www.live163.info/forum-155-1.html'
    let result = await process.filter(url, rout, 'pipe')
    if (result.cont && result.cont !== null) {
      simg.getcont(result.cont, result.url, rout)
    } else {
      console.log('cont is empty!'.red)
    }
  }
}

module.exports = ctrl
