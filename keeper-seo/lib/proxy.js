/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const Taobao = require('./taobao')
let taobao = new Taobao()
const Getip = require('./getip')
let getip = new Getip()
const Myseo = require('./seo')
let seo = new Myseo()

let Delay = require('keeper-core/lib/delay')
let delay = new Delay()

const Render = require('keeper-core/lib/render')
let render = new Render()
const accbox = require('../config/account')

const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
const iplist = require('../config/iplist')

const Logger = require('keeper-core')
let logger = new Logger()

let browser
let ipdate = mytime.mydate('mins')
logger.myconsole('Program start at : '.blue + ipdate)
let ipindex = 1

// constructor
class InitJs {
  constructor () {
    this.options = {
      changeiptime: 120 // how long does ip address change
    }
  }

  async init (tempip) {
    return new Promise(async (resolve) => {
      let args = ['--no-sandbox', '--disable-setuid-sandbox']
      if (tempip) args.push('--proxy-server=' + tempip)
      browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        // headless: false,
        args: args
      })
      logger.myconsole('browser is start!'.green)
      await delay.delay(0)

      // router
      require('../koa/router/ctrl')
      resolve(true)
    })
  }

  async changeip (index) {
    if (index) {
      if (index === iplist.length) {
        ipindex = -1
      }
      let tempip = iplist[index - 1].address + ':' + iplist[index - 1].host
      await this.restart(tempip)
    } else {
      await this.restart()
    }
    this.getip()
  }

  async restart (proxy) {
    await this.close()
    logger.myconsole('System will restart at 1 seconds later...'.yellow)
    await delay.delay(0)
    await this.init(proxy)
    ipdate = mytime.mydate('mins')
    logger.myconsole(ipdate)
  }

  async close () {
    await browser.close()
  }

  async taobao (type, url) {
    let cache = true
    let result = await taobao.taobao(browser, type, url, cache)

    // check ip date
    let ispass = mytime.dateispass(ipdate.split('-'), this.options.changeiptime)
    if (ispass) {
      await this.changeip(ipindex)
      ipindex += 1
    }

    return result
  }

  async getip () {
    let data = await getip.getip(browser)
    return data
  }

  async login (loginurl, url, account) {
    const page = await browser.newPage()

    let file = path.join(__dirname, '/../tpl/acc.js')
    const tpl = fs.readFileSync(file).toString()
    let param = {
      acc: accbox[account].acc,
      psw: accbox[account].psw
    }
    let mystr = render.renderdata(tpl, param)

    const Login = eval(mystr)
    let login = new Login()

    let data = await login.login(page, loginurl, url, account)
    return data
  }

  async seo (rout, myurl, search, title) {
    let data = await seo.seo(browser, rout, myurl, search, title)
    return data
  }
}

module.exports = InitJs
