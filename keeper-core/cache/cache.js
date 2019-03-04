/**
 * author:nero
 */
let path = require('path')
const fs = require('fs'), Fswritefile = require('../lib/writefile')
let writefile = new Fswritefile
const Fsdel = require('../lib/delete')
let del = new Fsdel
const Fslog = require('keeper-core')
let log = new Fslog
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime

class Cache {
  constructor () {this.options = {errfile: '../logfile/error.txt', gpath: '../../../cache/', cacheinfor: '/infor.txt', cachemins: 30}}

  readcache (a, b) {
    return new Promise(c => {
      let d = !1, e = path.join(__dirname, this.options.gpath + b + this.options.cacheinfor)
      if (fs.existsSync(e)) {
        let f = fs.readFileSync(e).toString(), g = JSON.parse('[' + f + ']')
        g.reverse()
        let h = mytime.getdate()
        for (let j in h.setMinutes(h.getMinutes() - this.options.cachemins), h = h.getTime(), g) {
          let k = Object.values(g[j]), l = Object.keys(g[j]), m = l[0].substr(l[0].indexOf('/') + 1), n = m > h ? 1 : 0
          if (n) {
            let o = encodeURIComponent(a)
            if (k[0] === o) {
              let p = path.join(__dirname, this.options.gpath + b + '/' + l[0] + '.html')
              fs.existsSync(p) && (d = fs.readFileSync(p).toString()), log.mybuffer({Read: l + '.html', date: mytime.mytime(), url: a}), log.writelog(
                'success', b)
            }
          } else break
        }
      }
      c(d)
    })
  }

  writecache (a, b, c) {
    let d = mytime.getdate(), e = mytime.mydate('mins')
    b = encodeURIComponent(b)
    let f = path.join(__dirname, this.options.gpath + c + '/infor/' + e + '.txt'),
      g = path.join(__dirname, this.options.gpath + c + this.options.cacheinfor)
    this.appendfile(f, d, b, e), this.appendfile(g, d, b, e)
    let h = path.join(__dirname, this.options.gpath + c + '/' + e + '/' + d.getTime() + '.html')
    writefile.writejs(h, a), 'error' === c ? log.myconsole('Create error cache file!'.red) : log.myconsole('Create cache file!'.blue), log.mybuffer(
      {Cache: e + '/' + d.getTime() + '.html'})
  }

  appendfile (a, b, c, d) {
    let e = fs.existsSync(a), f = (e ? ',\n{"' : '{"') + d + '/' + b.getTime() + '":"' + c + '"}'
    writefile.append(a, f)
  }

  delcache (a, b) {
    let c = this, d = path.join(__dirname, this.options.gpath + a + '/')
    fs.existsSync(d) ? fs.readdir(d, function (e, f) {
      if (e) throw e
      f.forEach(function (g, h) {
        fs.stat(d + g, function (k, l) {
          if (k) throw k
          if (l.isDirectory()) {
            let m = g.split('-')
            if (2 < m.length) {
              let n = mytime.dateispass(m, b)
              if (n) {
                let o = path.join(__dirname, c.options.gpath + a + '/' + g + '/')
                del.deleteSource(o, 'all')
                let p = path.join(__dirname, c.options.gpath + a + '/infor/' + g + '.txt')
                fs.existsSync(p) && del.deleteSource(p)
              }
            }
          }
          h === f.length - 1 && c.updatecacheinfor(a)
        })
      })
    }) : console.log('dir is not exist!'.red)
  }

  updatecacheinfor (a) {
    let b = this
    a || (a = 'buy')
    let c = path.join(__dirname, this.options.gpath + a + '/infor/'), d = ''
    fs.existsSync(c) ? fs.readdir(c, function (e, f) {
      if (e) throw e
      f.forEach(function (g, h) {
        let j = c + g
        fs.stat(j, function (k, l) {
          if (k) throw k
          if (l.isFile() && (d = (d ? d + ',\n' : '') + fs.readFileSync(j), h === f.length - 1)) {
            let m = path.join(__dirname, b.options.gpath + a + b.options.cacheinfor)
            writefile.writejs(m, d), console.log(m.yellow + ' is update!'.green)
          }
        })
      })
    }) : console.log('dir is empty!'.red)
  }
}

module.exports = Cache
