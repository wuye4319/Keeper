const Fscache = require('keeper-core/cache/cache'), cache = new Fscache, Fslog = require('keeper-core/logger/logger')
let logger = new Fslog
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime, logincount = 0, apidata = !1

class InitJs {
  async getcont (a, b, c) {
    return new Promise(async d => {
      let f = !1
      if (f = this.isJson(a), f && a) {apidata = !0, logincount && !b && (logincount -= 1)} else {
        let g = await this.befailed(a, b, c)
        'changeip' === g ? d('changeip') : d('Analysis failed!')
      }
      d(a)
    })
  }

  async taobao (a, b, c, d, f, g) {
    return new Promise(async h => {
      let i = Date.now(), j = '', k = !1, l = {}, m = await a.newPage()
      await m.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'), apidata = !1, logger.myconsole(
        mytime.mytime())
      try {
        let n = async (o, p) => {
          o += 1, 60 < o && (p = 'Failed', logger.myconsole('Wait api data failed!'.red)), p
            ? (logger.myconsole('Web page opens normally '.green + f + (g ? ', backup service!'.red : '')), p = await this.getcont(p, g, c), h(
              p), i = Date.now() - i, l.Loadingtime = (i / 1e3).toString() + ' s', logger.myconsole('Loading time : '.green + l.Loadingtime.red), d &&
            apidata && p && cache.writecache(p, c, b), l.apidata = apidata && p ? 'success' : 'Failed')
            : setTimeout(function () {n(o, p)}, 100)
        }
        m.on('response', async o => {
          if (!k) {
            let p = -1 !== o.url().indexOf('taobao.com/search?ajax=true')
            if (p) try {j = await o.text(), k = !0, n(0, j)} catch (q) {h('Analysis failed!'), logger.myconsole('Get filter failed!'.red + f + q)}
          }
        }), await m.goto(c), await m.close(), k ||
        (g ? logger.myconsole('Self browser product is missing! '.yellow + f) : logger.myconsole('Product is missing! '.yellow + f), h(
          'Product is missing!')), l.date = mytime.mytime(), l.url = c, logger.mybuffer(l), logger.writelog('success', b)
      } catch (n) {h(!1), logger.myconsole('System error! Or page timeout!'.red), await m.close()}
    })
  }

  async befailed (a, b, c) {
    if (b ? logger.myconsole('Self browser analysis failed!'.red) : logger.myconsole('Analysis failed!'.red), !b) if (1 >
      logincount) {logincount += 1} else return logincount = 0, 'changeip'
    return cache.writecache(a, c, 'error'), !1
  }

  isJson (a) {
    try {
      a = JSON.parse(a)
      let b = 'object' == typeof a && '[object object]' === Object.prototype.toString.call(a).toLowerCase() && !a.length
      if (b) {
        let c = JSON.stringify(a).indexOf('login.taobao.com/member/login.jhtml?')
        return !(-1 !== c) || (logger.myconsole('Login redirect!'.red), !1)
      }
    } catch (b) {return !1}
  }
}

module.exports = InitJs
