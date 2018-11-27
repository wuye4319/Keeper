const fs = require('fs'), Proxy = require('../../lib/proxy')
let proxy = new Proxy
const Logger = require('keeper-core')
let logger = new Logger
const Fscache = require('keeper-core/cache/cache'), cache = new Fscache
let internumb = 0, urlbox = []

class ctrl {
  async filter (a, b) {
    logger.myconsole('process : '.red + internumb.toString().red), logger.myconsole(a), logger.myconsole('<p style="color: red">process : ' +
      internumb + '</p>', 'web'), logger.myconsole('<p>' + a + '</p>', 'web')
    let c
    if (15 < internumb) {
      logger.myconsole(
        'Server is busy,please wait...'), await proxy.close(), await proxy.init(), await proxy.initproxybrowser(), this.clearinternumb()
    } else {
      internumb += 1
      let d = this.eachurl(urlbox, a)
      if (d) {logger.myconsole('Repeat request!'.red), logger.myconsole('<p style="color: red">Repeat request!</p>', 'web')} else {
        urlbox.push(a)
        let e = Date.now(), f = await cache.readcache(a, b)
        e = Date.now() - e, logger.myconsole('<p style="color: green">read cache time : <span style="color: red">' + e.toString() + '</span> ms</p>',
          'web'), f
          ? (c = f, logger.myconsole('this is cache file!'), logger.myconsole('<p>this is cache file!</p>', 'web'))
          : 'search' === b
            ? c = await proxy.search(b, a, internumb)
            : c = await proxy.taobao(b, a, internumb), urlbox.splice(d - 1, 1), urlbox.length
          ? logger.myconsole(JSON.stringify(urlbox))
          : logger.myconsole('[]'), urlbox.length ? logger.myconsole('<p>' + JSON.stringify(urlbox) + '</p>', 'web') : logger.myconsole('<p>[]</p>',
          'web')
      }
      internumb -= 1
    }
    return c
  }

  async filtermall (a, b) {
    let c = a.url.substr(b.length + 2), d = await this.filter(c, b)
    a.response.body = d ? d : 'Get data failed!'
  }

  async slidelock (a, b) {
    let c = a.url.substr(b.length + 2), d = await proxy.autoslide(c)
    a.response.body = d ? d : 'Get data failed!'
  }

  async filtersearch (a, b, c) {
    let e = await this.filter('https://s.taobao.com/search?ajax=true&app=mainsrp&q=' + c, b)
    a.response.body = e ? e : 'Get data failed!'
  }

  async getstate (a, b, c, d) {
    let e = await proxy.getstate(c, d)
    a.response.body = e ? e : 'Get data failed!'
  }

  eachurl (a, b) {
    let c = !1
    for (let d in a) a[d] === b && (c = d + 1)
    return c
  }

  clearinternumb () {internumb = 0, urlbox = []}

  async ctrlproxy (a, b) {
    '0' === b ? proxy.closeproxy() : '1' === b ? proxy.openproxy() : '2' === b ? await proxy.manualchangeip() : void 0
    a.response.body = 'success'
  }

  async autoproxy (a, b) {
    '0' === b ? proxy.manualchangeip() : '1' === b ? proxy.autoproxy() : void 0
    a.response.body = 'success'
  }

  nextbrowser (a) {proxy.changebrowser(), a.response.body = 'success'}

  async loginbycode (a, b, c) {
    if (b) {
      let d = await proxy.loginbycode(b, c), e = Math.ceil(1e9 * Math.random())
      a.response.body = d ? '<img src="/source/img/warmachine/codeimg/codeimg' + b + (c || '') + '.png?' + e + '" /><p><a href="/loginstatus/' + b +
        (c || '') + '/">click to check login status</a></p>' : 'error'
    } else a.response.body = 'Please choose browser, use key [self] or [curr]'
  }

  async loginstatus (a, b) {
    let c = Math.ceil(1e9 * Math.random())
    b = b || ''
    let d = './static/source/img/warmachine/codeimg/loginstatus' + b + '.png', e = fs.statSync(d),
      f = '<img src="/source/img/warmachine/codeimg/loginstatus' + b + '.png?' + c + '" />', g = '<p>' + e.mtime + '</p>'
    a.response.body = f + g
  }

  async weblogger (a) {
    let b = logger.getweblog(), d = fs.readFileSync('./weblog/' + b + '.txt').toString()
    a.response.body = d
  }
}

module.exports = ctrl
