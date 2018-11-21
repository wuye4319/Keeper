const Fslog = require('keeper-core')
let logger = new Fslog
const Fscache = require('keeper-core/cache/cache'), cache = new Fscache, Mytime = require('keeper-core/lib/time')
let mytime = new Mytime, logincount = 0, apidata = !1

class InitJs {
  async getcont (a, b, c, d) {
    return new Promise(async f => {
      let g = !1
      'Failed' === b && (b = !1)
      let j
      try {j = b.match(/<script>var _DATA_Mdskip =  ([\s\S]+) <\/script>\s+<script src=/)[1]} catch (k) {
        logger.myconsole('String is error : '.red + k)
      }
      if (g = !!j && this.isJson(j, a), g && b) {apidata = !0, logincount && !c && (logincount -= 1)} else {
        let k = await this.befailed(b, c, d)
        'changeip' === k ? f('changeip') : f('Analysis failed!')
      }
      b = '\n<script>\nvar apidata_tmall = ' + j + '\n</script>', f(b)
    })
  }

  async tmall (a, b, c, d, f, g) {
    return new Promise(async h => {
      let i = Date.now(), j = '', k = !1, l = {}, m = await a.newPage()
      await m.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'), apidata = !1
      let n = c.substr(c.lastIndexOf('/'))
      logger.myconsole(mytime.mytime())
      try {
        let o = async p => {
          p += 1, 60 < p && (j = 'Failed', h(j), logger.myconsole('Wait cont failed!'.red)), j
            ? (k = !0, logger.myconsole('Web page opens normally '.green + f + (g ? ', backup service!'.red : '')), j = await this.getcont(a, j, g,
              c), h(j), i = Date.now() - i, l.Loadingtime = (i / 1e3).toString() + ' s', logger.myconsole('Loading time : '.green +
              l.Loadingtime.red))
            : setTimeout(function () {o(p)}, 100)
        }
        m.on('response', async p => {
          if (!k) {
            if (-1 !== p.url().indexOf(n)) try {j += await p.text(), await o(0, j)} catch (q) {logger.myconsole(q + ' ' + f)}
            -1 === p.url().indexOf('mdetail.tmall.com/mobile/') ? -1 !== p.url().indexOf('sec.taobao.com/query.htm') &&
              (logger.myconsole('Verification Code!'.red), h('Product is missing!'), m.close()) : (g
              ? logger.myconsole('Self browser product is missing! '.yellow + f)
              : logger.myconsole('Product is missing! '.yellow + f), h('Product is missing!'), m.close())
          }
        }), await m.goto(c), await m.close(), k ||
        (g ? logger.myconsole('Self browser product is missing! '.yellow + f) : logger.myconsole('Product is missing! '.yellow + f), h(
          'Product is missing!')), l.date = mytime.mytime(), l.url = c, logger.mybuffer(l), logger.writelog('success', b)
      } catch (o) {h(!1), logger.myconsole('System error! Or page timeout!'.red), await m.close()}
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
      let c = 'object' == typeof a && '[object object]' === Object.prototype.toString.call(a).toLowerCase() && !a.length
      return c
    } catch (c) {return !1}
  }

  subresult (a) {return a = a.substr(a.indexOf('(') + 1), a = a.substr(0, a.lastIndexOf(')')), a}
}

module.exports = InitJs
