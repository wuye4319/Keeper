/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const Fslog = require('../base/logger')
let logger = new Fslog()

const Fastpost = require('./urldata')
let fastpost = new Fastpost()
const Clearcart = require('./clearcart')
let clearcart = new Clearcart()
const Getcodeimg = require('./getcodeimg')
let getcodeimg = new Getcodeimg()

let Delay = require('../base/delay')
let delay = new Delay()
const Render = require('../base/render')
let render = new Render()
const accbox = require('../config/account')

const Mytime = require('../base/time')
let mytime = new Mytime()

let browser
let selfbrowser = {}
let ipdate = mytime.mydate('mins')
logger.myconsole('Program start at : ' + ipdate)
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

// constructor
class InitJs {
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
    logger.myconsole('set ip interval : ' + changeiptime + ' mins')
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
      logger.myconsole('self browser' + i + ' is start!')
      // router
      resolve(tempbrowser)
    })
  }

  async initproxybrowser () {
    if (proxyserver) {
      let proxy = iplist[0].address + ':' + iplist[0].host
      await this.newbrowser(proxy)
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
      logger.myconsole('browser is start!')
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
    await getcodeimg.writeacc(false, 'curr')
  }

  async restart (proxy) {
    ipdate = mytime.mydate('mins')
    logger.myconsole(ipdate)
    logger.myconsole('changeiptime : ' + changeiptime)
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
    logger.myconsole('Active change ip is start!')
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

  async taobao (type, url, process, data, cart, islast) {
    let cache = systemconfig.cache
    let currbrow = proxyserver ? browser : selfbrowser[browserindex]
    let result = await fastpost.taobao(currbrow, type, url, cache, process, data, cart, islast)

    if (proxyserver) {
      result = this.servermatrix(type, url, process, result)
    }
    // result.url = url
    return result === 'changeip' ? 'Analysis failed!' : result
  }

  async clearcart () {
    let currbrow = proxyserver ? browser : selfbrowser[browserindex]
    let result = await clearcart.clear(currbrow)
    // result.url = url
    return result
  }

  async loginbycode (browsertype, index, ctx) {
    let data
    if (browsertype === 'self') {
      data = await getcodeimg.getimg(selfbrowser[index || browserindex], browsertype + (index || browserindex), ctx)
    } else if (browsertype === 'curr' && proxyserver) {
      data = await getcodeimg.getimg(browser, browsertype)
    } else {
      data = false
    }

    return data
  }
}

module.exports = InitJs
