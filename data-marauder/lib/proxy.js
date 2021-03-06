/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
require('colors')
const puppeteer = require('puppeteer')
const Pipedata = require('./pipe')
let pipedata = new Pipedata()
const DataPage = require('./page')
let pagedata = new DataPage()
const Dataurl = require('./url')
let dataurl = new Dataurl()
const Getip = require('./getip')
let getip = new Getip()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()
// const Getstate = require('./getstate')
// let getstate = new Getstate()

const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
const Logger = require('keeper-core')
let logger = new Logger()
const systemconfig = require('../config/system')
const Getcodeimg = require('./codeimg')
let getcodeimg = new Getcodeimg()

const GetTaoCode = require('./taocode')
let getTaocode = new GetTaoCode()

let browser = []
let selfbrowser = {}
let ipdate = mytime.mydate('mins')
logger.myconsole('Program start at : '.blue + ipdate)
let ipindex = 0
let browserindex = 0
let proxyindex = 0

// change ip active
let changeipactive = systemconfig.changeipactive
// ip proxy list
const iplist = require('../config/iplist')
// change ip interval time, [mins]
let changeiptime = systemconfig.changeiptime
// let processbox = []
let proxyserver = systemconfig.proxyserver
// const SlideLock = require('./slidelock')
// let slidelock = new SlideLock()

// constructor
class InitJs {
  // controll proxy
  closeproxy() {
    proxyserver = 0
    browser.close()
  }

  openproxy() {
    proxyserver = 1
    this.initproxybrowser()
  }

  changebrowser() {
    browserindex += 1
    // if (index) {
    if (browserindex >= systemconfig.browsernumb) {
      browserindex = 0
    }
  }

  setipinterval(time) {
    changeiptime = time
    console.log('set ip interval : ' + changeiptime + ' mins')
  }

  changeproxy() {
    proxyindex += 1
    logger.myconsole('proxy : '.green + proxyindex)
    // if (index) {
    if (proxyindex >= systemconfig.proxyserver) {
      proxyindex = 0
    }
  }

  async init() {
    let numb = systemconfig.browsernumb
    for (let i = 0; i < numb; i++) {
      selfbrowser[i] = await this.creatbrowser(i)
    }
  }

  // self
  async creatbrowser(i) {
    return new Promise(async (resolve) => {
      let tempbrowser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: {
          width: 1200,
          height: 800
        }
      })
      logger.myconsole('self browser' + i + ' is start!'.green)
      // router
      resolve(tempbrowser)
    })
  }

  async initproxybrowser() {
    if (proxyserver) {
      for (let i = 0; i < proxyserver; i++) {
        let proxy = iplist[i].address + ':' + iplist[i].host
        browser[i] = await this.newbrowser(proxy)
        await this.getip(browser[i])
      }
    }
  }

  // proxy
  async newbrowser(tempip) {
    return new Promise(async (resolve) => {
      let args = ['--no-sandbox', '--disable-setuid-sandbox']
      if (tempip) args.push('--proxy-server=' + tempip)
      let tempbrowser = await puppeteer.launch({
        ignoreDefaultArgs: true,
        // headless: false,
        args: args
      })
      logger.myconsole('browser is start!'.magenta)
      await delay.delay(0)

      // router
      resolve(tempbrowser)

      // setTimeout(function () {
      //   if (processbox.length) {
      //     for (let i in processbox) {
      //       processbox[i].close()
      //     }
      //   }
      // }, 8000)
    })
  }

  async changeip() {
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

  async restart(proxy) {
    ipdate = mytime.mydate('mins')
    logger.myconsole(ipdate)
    logger.myconsole('changeiptime : '.green + changeiptime)
    await this.newbrowser(proxy)
  }

  getproxystatus() {
    let temp = {
      'ipindex': proxyserver ? ipindex : -1,
      'browserindex': browserindex,
      'changeipactive': changeipactive,
      'changeiptime': changeiptime
    }
    return temp
  }

  async close() {
    for (let i in selfbrowser) {
      await selfbrowser[i].close()
    }
    if (browser.length) {
      for (let i in browser) {
        await browser[i].close()
      }
    }
  }

  async manualchangeip() {
    changeipactive = false
    await this.changeip()
  }

  autoproxy() {
    changeipactive = true
    console.log('Active change ip is start!'.green)
  }

  getproxylist() {
    return iplist
  }

  async pagedata(type, url, process) {
    let cache = systemconfig.cache
    let currbrow = systemconfig.backupserver ? browser : selfbrowser
    let result = await pagedata.getdata(currbrow, type, url, cache, process)

    return result === 'changeip' ? 'Analysis failed!' : result
  }

  async servermatrix(type, url, process, result) {
    let cache = systemconfig.cache
    // when the first one is done, it will stop the second
    // check ip date
    // let ispass = mytime.dateispass(ipdate.split('-'), changeiptime)
    // if (changeipactive && (ispass || result === 'changeip')) {
    //   this.changeip()
    // }

    if (result === 'changeip' || result === 'Analysis failed!' || result === 'Product is missing!') {
      result = await fastpost.taobao(selfbrowser[browserindex], type, url, cache, process, true)
    }
    return result
  }

  async pipedata(type, url, process, rules) {
    !proxyserver || this.changeproxy()
    let cache = systemconfig.cache
    let currbrow = proxyserver ? browser[proxyindex] : selfbrowser[browserindex]

    rules = rules || false
    let result = await pipedata.getdata(currbrow, type, url, rules, process)

    if (systemconfig.backupserver) {
      result = this.servermatrix(type, url, process, result)
    }
    result.url = url
    return result
  }

  async urldata(url) {
    // let cache = systemconfig.cache
    let result = await dataurl.getdata(url)

    return result
  }

  async getip(myproxy) {
    let data = await getip.getip(myproxy)
    return data
  }

  async loginbycode(browsertype, index) {
    let data
    if (browsertype === 'self') {
      data = await getcodeimg.getimg(selfbrowser[index || browserindex], browsertype + (index || browserindex))
    } else if (browsertype === 'curr' && proxyserver) {
      data = await getcodeimg.getimg(browser[index || proxyindex], browsertype + (index || proxyinde))
    } else {
      data = false
    }

    return data
  }

  async getstate(browsertype, index) {
    let data = false
    if (browsertype === 'self') {
      data = await getstate.getstate(selfbrowser[index || browserindex], browsertype + (index || browserindex))
    } else if (browsertype === 'curr' && proxyserver) {
      data = await getstate.getstate(browser[index || proxyindex], browsertype + (index || proxyindex))
    }

    return data
  }

  async login(loginurl, url, account) {
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

  // get taobao code
  async getTaocode(browsertype, index) {
    let data
    if (browsertype === 'self') {
      data = await getTaocode.getTaocode(selfbrowser[index || browserindex], browsertype + (index || browserindex))
    } else if (browsertype === 'curr' && proxyserver) {
      data = await getTaocode.getTaocode(browser[index || proxyindex], browsertype + (index || proxyinde))
    } else {
      data = false
    }

    return data
  }

}

module.exports = InitJs
