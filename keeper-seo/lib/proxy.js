/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const Fastpost = require('./urldata')
let fastpost = new Fastpost()
const Getip = require('./getip')
let getip = new Getip()
const Getcodeimg = require('./getcodeimg')
let getcodeimg = new Getcodeimg()

const Myseo = require('./seo')
let seo = new Myseo()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()
const Render = require('keeper-core/lib/render')
let render = new Render()
const accbox = require('../config/account')

const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
const Logger = require('keeper-core')
let logger = new Logger()
const Logintest = require('../lib/auto-login')
let logintest = new Logintest()

let browser
let selfbrowser = {}
let ipdate = mytime.mydate('mins')
logger.myconsole('Program start at : '.blue + ipdate)
logger.myconsole('<p style="color: blue;">Program start at : ' + ipdate + '</p>', 'web')
const systemconfig = require('../config/system')
let ipindex = 0
let browserindex = 0

// change ip active
let changeipactive = systemconfig.changeipactive
// ip proxy list
const iplist = require('../config/iplist')
// change ip interval time, [mins]
let changeiptime = systemconfig.changeiptime
let processbox = []
let proxyserver = systemconfig.proxyserver

const SlideLock = require('./slidelock')
let slidelock = new SlideLock()

// constructor
class InitJs {
  async autoslide (url) {
    let res = await slidelock.autoslide(selfbrowser[browserindex], url)
    return res
  }

  // controll proxy
  closeproxy () {
    proxyserver = 0
    browser.close()
  }

  openproxy () {
    proxyserver = 1
    this.initproxybrowser()
  }

  setipinterval (time) {
    changeiptime = time
    console.log('set ip interval : ' + changeiptime + ' mins')
  }

  changebrowser () {
    browserindex += 1
    // if (index) {
    if (browserindex >= systemconfig.browsernumb) {
      browserindex = 0
    }
  }

  async init () {
    let numb = systemconfig.browsernumb
    for (let i = 0; i < numb; i++) {
      selfbrowser[i] = await this.creatbrowser(i)
    }
  }

  // self browser
  async creatbrowser (i) {
    return new Promise(async (resolve) => {
      let tempbrowser = await puppeteer.launch({
        ignoreDefaultArgs: true,
        // headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      logger.myconsole('self browser' + i + ' is start!'.green)
      // router
      resolve(tempbrowser)
    })
  }

  async initproxybrowser () {
    if (proxyserver) {
      let proxy = iplist[0].address + ':' + iplist[0].host
      await this.newbrowser(proxy)
      await this.getip()
    }
  }

  async newbrowser (tempip) {
    return new Promise(async (resolve) => {
      if (browser) processbox.push(browser)
      let args = ['--no-sandbox', '--disable-setuid-sandbox']
      if (tempip) args.push('--proxy-server=' + tempip)
      browser = await puppeteer.launch({
        ignoreDefaultArgs: true,
        // headless: false,
        args: args
      })
      logger.myconsole('browser is start!'.magenta)
      await delay.delay(0)

      // router
      resolve(true)

      setTimeout(function () {
        if (processbox.length) {
          for (let i in processbox) {
            processbox[i].close()
          }
        }
      }, 8000)
    })
  }

  async changeip () {
    ipindex += 1
    // if (index) {
    if (ipindex >= iplist.length) {
      ipindex = 0
    }
    let tempip = iplist[ipindex].address + ':' + iplist[ipindex].host
    await this.restart(tempip)
    // } else {
    //   await this.restart()
    // }
    await this.getip()
    await getcodeimg.writeacc(false, 'curr')
  }

  async restart (proxy) {
    ipdate = mytime.mydate('mins')
    logger.myconsole(ipdate)
    logger.myconsole('changeiptime : '.green + changeiptime)
    // web log
    logger.myconsole('<p>' + ipdate + '</p>', 'web')
    logger.myconsole('<p style="color: green">changeiptime : </p>' + changeiptime, 'web')
    await this.newbrowser(proxy)
  }

  getproxystatus () {
    let temp = {
      'ipindex': proxyserver ? ipindex : -1,
      'browserindex': browserindex,
      'changeipactive': changeipactive,
      'changeiptime': changeiptime
    }
    return temp
  }

  async close () {
    for (let i in selfbrowser) {
      await selfbrowser[i].close()
    }
    if (proxyserver) await browser.close()
  }

  async manualchangeip () {
    changeipactive = false
    await this.changeip()
  }

  autoproxy () {
    changeipactive = true
    console.log('Active change ip is start!'.green)
  }

  getproxylist () {
    return iplist
  }

  async servermatrix (type, url, process, result) {
    let cache = systemconfig.cache
    // when the first one is done, it will stop the second
    // check ip date
    let ispass = mytime.dateispass(ipdate.split('-'), changeiptime)
    if (changeipactive && (ispass || result === 'changeip')) {
      this.changeip()
    }

    if (result === 'changeip' || result === 'Analysis failed!' || result === 'Product is missing!') {
      result = await fastpost.taobao(selfbrowser[browserindex], type, url, cache, process, true)
    }
    return result
  }

  async taobao (type, url, process) {
    let cache = systemconfig.cache
    let currbrow = proxyserver ? browser : selfbrowser[browserindex]
    let result = await fastpost.taobao(currbrow, type, url, cache, process)

    if (proxyserver) {
      result = this.servermatrix(type, url, process, result)
    }
    // result.url = url
    return result === 'changeip' ? 'Analysis failed!' : result
  }

  async getip () {
    let data = await getip.getip(browser)
    return data
  }

  async loginbycode (browsertype, index) {
    let data
    if (browsertype === 'self') {
      data = await getcodeimg.getimg(selfbrowser[index || browserindex], browsertype + (index || browserindex))
    } else if (browsertype === 'curr' && proxyserver) {
      data = await getcodeimg.getimg(browser, browsertype)
    } else {
      data = false
    }

    return data
  }

  async login (loginurl, url, account) {
    const page = await selfbrowser[browserindex].newPage()

    let file = path.join(__dirname, '/acc.js')
    const tpl = fs.readFileSync(file).toString()
    let param = {
      acc: accbox[account].acc,
      psw: accbox[account].psw
    }
    let mystr = render.renderdata(tpl, param)

    const Login = eval(mystr)
    let login = new Login()

    let data = await login.login(page, loginurl, url)
    return data
  }

  async logintest (loginurl, url) {
    const page = await selfbrowser[browserindex].newPage()

    let data = await logintest.login(page, loginurl, url)
    return data
  }

  async seo (rout, myurl, search, title) {
    let data = await seo.seo(browser, rout, myurl, search, title)
    return data
  }
}

module.exports = InitJs
