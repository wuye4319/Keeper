/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const Fastpost = require('./fastpost')
let fastpost = new Fastpost()
const Taobao = require('./taobao')
let taobao = new Taobao()
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

let browser
let selfbrowser
let ipdate = mytime.mydate('mins')
logger.myconsole('Program start at : '.blue + ipdate)
let ipindex = 1

// change ip active
let changeipactive = true

// ip proxy list
const iplist = require('../config/iplist3')
// change ip interval time, [mins]
let changeiptime = 10
let processbox = []

// constructor
class InitJs {
  setipinterval (time) {
    changeiptime = time
    console.log('set ip interval : ' + changeiptime + ' mins')
  }

  async init () {
    return new Promise(async (resolve) => {
      selfbrowser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        // headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      logger.myconsole('self browser is start!'.green)
      await delay.delay(0)

      // router
      resolve(true)
    })
  }

  async initproxybrowser () {
    let proxy = iplist[0].address + ':' + iplist[0].host
    await this.newbrowser(proxy)
    await this.getip()
  }

  async newbrowser (tempip) {
    return new Promise(async (resolve) => {
      if (browser) processbox.push(browser)
      let args = ['--no-sandbox', '--disable-setuid-sandbox']
      if (tempip) args.push('--proxy-server=' + tempip)
      browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
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

  async changeip (index) {
    // if (index) {
    if (index === iplist.length) {
      ipindex = 0
    }
    let tempip = iplist[index].address + ':' + iplist[index].host
    await this.restart(tempip)
    // } else {
    //   await this.restart()
    // }
    await this.getip()
  }

  async restart (proxy) {
    ipdate = mytime.mydate('mins')
    logger.myconsole(ipdate)
    logger.myconsole('changeiptime : '.green + changeiptime)
    await this.newbrowser(proxy)
  }

  async close () {
    await selfbrowser.close()
    await browser.close()
  }

  manualchangeip () {
    changeipactive = false
    this.changeip(ipindex)
    ipindex += 1
  }

  autoproxy () {
    changeipactive = true
    console.log('Active change ip is start!'.green)
  }

  async taobao (type, url, process) {
    let cache = true
    let result = await fastpost.taobao(browser, type, url, cache, process)

    // when the first one is done, it will stop the second
    // check ip date
    let ispass = mytime.dateispass(ipdate.split('-'), changeiptime)
    if (changeipactive && (ispass || result === 'changeip')) {
      this.changeip(ipindex)
      ipindex += 1
    }

    if (result === 'changeip' || result === 'Analysis failed!' || result === 'Product is missing!') {
      result = await fastpost.taobao(selfbrowser, type, url, cache, process, true)
    }

    return result === 'changeip' ? 'Analysis failed!' : result
  }

  async getip () {
    let data = await getip.getip(browser)
    return data
  }

  async loginbycode (browser) {
    let data
    if (browser === 'self') {
      data = await getcodeimg.getimg(selfbrowser)
    } else if (browser === 'curr') {
      data = await getcodeimg.getimg(browser)
    }

    return data
  }

  async login (loginurl, url, account) {
    const page = await browser.newPage()

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

  async seo (rout, myurl, search, title) {
    let data = await seo.seo(browser, rout, myurl, search, title)
    return data
  }
}

module.exports = InitJs
