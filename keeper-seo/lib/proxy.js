const puppeteer = require('puppeteer'), path = require('path'), fs = require('fs'), Fastpost = require('./urldata')
let fastpost = new Fastpost
const Search = require('../work/search')
let search = new Search
const Getip = require('./getip')
let getip = new Getip
const Getcodeimg = require('./getcodeimg')
let getcodeimg = new Getcodeimg, Delay = require('keeper-core/lib/delay'), delay = new Delay
const Render = require('keeper-core/lib/render')
let render = new Render
const accbox = require('../config/account'), Mytime = require('keeper-core/lib/time')
let mytime = new Mytime
const Logger = require('keeper-core')
let logger = new Logger
let browser = [], selfbrowser = {}, ipdate = mytime.mydate('mins')
logger.myconsole('Program start at : '.blue + ipdate), logger.myconsole('<p style="color: blue;">Program start at : ' + ipdate + '</p>', 'web')
const systemconfig = require('../config/system')
let ipindex = 0, browserindex = 0, proxyindex = 0, changeipactive = systemconfig.changeipactive
const iplist = require('../config/iplist')
let changeiptime = systemconfig.changeiptime, proxyserver = systemconfig.proxyserver

class InitJs {
  closeproxy () {proxyserver = 0, browser.close()}

  openproxy () {proxyserver = 1, this.initproxybrowser()}

  setipinterval (a) {changeiptime = a, console.log('set ip interval : ' + changeiptime + ' mins')}

  changebrowser () {browserindex += 1, browserindex >= systemconfig.browsernumb && (browserindex = 0)}

  changeproxy () {proxyindex += 1, logger.myconsole('proxy : '.green + proxyindex), proxyindex >= systemconfig.proxyserver && (proxyindex = 0)}

  async init () {
    let a = systemconfig.browsernumb
    for (let b = 0; b < a; b++) selfbrowser[b] = await this.creatbrowser(b)
  }

  async creatbrowser (a) {
    return new Promise(async b => {
      let c = await puppeteer.launch({ignoreDefaultArgs: !0, args: ['--no-sandbox', '--disable-setuid-sandbox']})
      logger.myconsole('self browser' + a + ' is start!'.green), b(c)
    })
  }

  async initproxybrowser () {
    if (proxyserver) for (let b, a = 0; a < proxyserver; a++) b = iplist[a].address + ':' + iplist[a].host, browser[a] = await this.newbrowser(
      b), await this.getip(browser[a])
  }

  async newbrowser (a) {
    return new Promise(async b => {
      let c = ['--no-sandbox', '--disable-setuid-sandbox']
      a && c.push('--proxy-server=' + a)
      let d = await puppeteer.launch({ignoreDefaultArgs: !0, args: c})
      logger.myconsole('browser is start!'.magenta), await delay.delay(0), b(d)
    })
  }

  async changeip () {
    ipindex += 1, ipindex >= iplist.length && (ipindex = 0)
    let a = iplist[ipindex].address + ':' + iplist[ipindex].host
    await this.restart(a), await this.getip(), await getcodeimg.writeacc(!1, 'curr')
  }

  async restart (a) {
    ipdate = mytime.mydate('mins'), logger.myconsole(ipdate), logger.myconsole('changeiptime : '.green + changeiptime), logger.myconsole('<p>' +
      ipdate + '</p>', 'web'), logger.myconsole('<p style="color: green">changeiptime : </p>' + changeiptime, 'web'), await this.newbrowser(a)
  }

  getproxystatus () {
    let a = {
      ipindex: proxyserver ? ipindex : -1,
      browserindex: browserindex,
      changeipactive: changeipactive,
      changeiptime: changeiptime
    }
    return a
  }

  async close () {
    for (let a in selfbrowser) await selfbrowser[a].close()
    if (browser.length) for (let a in browser) await browser[a].close()
  }

  async manualchangeip () {changeipactive = !1, await this.changeip()}

  autoproxy () {changeipactive = !0, console.log('Active change ip is start!'.green)}

  getproxylist () {return iplist}

  async servermatrix (a, b, c, d) {
    let e = systemconfig.cache
    return ('changeip' === d || 'Analysis failed!' === d || 'Product is missing!' === d) &&
    (d = await fastpost.taobao(selfbrowser[browserindex], a, b, e, c, !0)), d
  }

  async taobao (a, b, c) {
    proxyserver && this.changeproxy()
    let d = systemconfig.cache, e = proxyserver ? browser[proxyindex] : selfbrowser[browserindex], f = await fastpost.taobao(e, a, b, d, c)
    return proxyserver && (f = this.servermatrix(a, b, c, f)), 'changeip' === f ? 'Analysis failed!' : f
  }

  async search (a, b, c) {
    proxyserver && this.changeproxy()
    let d = systemconfig.cache, e = proxyserver ? browser[proxyindex] : selfbrowser[browserindex], f = await search.taobao(e, a, b, d, c)
    return proxyserver && (f = this.servermatrix(a, b, c, f)), 'changeip' === f ? 'Analysis failed!' : f
  }

  async getip (a) {
    let b = await getip.getip(a)
    return b
  }

  async loginbycode (a, b) {
    let c
    return c = 'self' === a ? await getcodeimg.getimg(selfbrowser[b || browserindex], a + (b || browserindex)) : 'curr' === a && proxyserver &&
      (await getcodeimg.getimg(browser[b || proxyindex], a + (b || proxyinde))), c
  }

  async getstate (a, b) {
    let c = !1
    return 'self' === a ? c = await getstate.getstate(selfbrowser[b || browserindex], a + (b || browserindex)) : 'curr' == a && proxyserver &&
      (c = await getstate.getstate(browser[b || proxyindex], a + (b || proxyinde))), c
  }

  async login (loginurl, url, account) {
    const page = await selfbrowser[browserindex].newPage()
    let file = path.join(__dirname, '/acc.js')
    const tpl = fs.readFileSync(file).toString()
    let param = {acc: accbox[account].acc, psw: accbox[account].psw}, mystr = render.renderdata(tpl, param)
    const Login = eval(mystr)
    let login = new Login, data = await login.login(page, loginurl, url)
    return data
  }

  async logintest (a, b) {
    const c = await selfbrowser[browserindex].newPage()
    let d = await logintest.login(c, a, b)
    return d
  }
}

module.exports = InitJs
