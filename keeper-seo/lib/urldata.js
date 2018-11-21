const Fslog = require('keeper-core')
let logger = new Fslog
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime
const Fscache = require('keeper-core/cache/cache'), cache = new Fscache, Tmall = require('../work/tmall')
let tmall = new Tmall
const Taobao = require('../work/taobao')
let taobao = new Taobao

class InitJs {
  async taobao (a, b, c, d, f, g) {
    return new Promise(async h => {
      let i = '', j = !1, k = !1, l = {}, m = await a.newPage()
      await m.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')
      let n = c.substr(c.lastIndexOf('?') + 1)
      try {
        let o = async p => {
          if (p += 1, 60 < p && (i = 'Failed', h(i), logger.myconsole('Wait cont failed!'.red)), !i) {setTimeout(function () {o(p)}, 100)} else {
            j = !0
            let q
            if (k) {q = await tmall.tmall(a, b, 'https://detail.m.tmall.com/item.htm?' + n, !0, f, g)} else {
              let s = n.substr(n.indexOf('=') + 1)
              q = await taobao.taobao(a, b, 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=itemNumId%22%3A%22' + s + '%2C', !0,
                f, g)
            }
            i += q
            let r = q && 'Analysis failed!' !== q && 'changeip' !== q && 'Product is missing!' !== q
            d && r && cache.writecache(i, c, b), l.apidata = r ? 'success' : 'Failed', h(i)
          }
        }
        m.on('response', async p => {
          if (!j && -1 !== p.url().indexOf(n)) try {
            i += await p.text(), k = -1 !== p.url().indexOf('detail.tmall.com/item.htm?'), await o(0)
          } catch (q) {logger.myconsole(q + ' ' + f), logger.myconsole(p.url().yellow)}
        }), await m.goto(c), await m.close(), j ||
        (g ? logger.myconsole('Self browser cont is missing! '.yellow + f) : logger.myconsole('Cont is missing! '.yellow + f), h(
          'Cont is missing!')), l.date = mytime.mytime(), l.url = c, logger.mybuffer(l), logger.writelog('success', b)
      } catch (o) {h(!1), logger.myconsole('Cont page error! Or page timeout!'.red), await m.close()}
    })
  }
}

module.exports = InitJs
