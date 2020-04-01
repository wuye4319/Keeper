/**
 * Created by nero on 2018/4/26
 */
// http://www.se8pc.com/thread-9283739-1-11.html
const fs = require('fs')
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
const Rnav = require('../../regular/rnav')
let rnav = new Rnav()
const Simg = require('../simg')
let simg = new Simg()

class analysis {
  analy(cont, type, cachefile) {
    let rulbox = rnav.rule()
    let regular = rulbox.regular
    let deep = rulbox.deep
    for (let i in regular) {
      let tempobj = cont.match(regular[i])
      let deepobj
      const imgpath = './analysis/' + type + '/' + cachefile + '/rule' + i + '.js'
      writefile.writejs(imgpath, JSON.stringify(tempobj))
      if (deep) {
        for (let d in deep) {
          deepobj = this.matchnewarr(tempobj, deep[d])
          const deepPath = './analysis/' + type + '/' + cachefile + '/deep' + i + d + '.js'
          writefile.writejs(deepPath, JSON.stringify(deepobj))
        }
      }
    }
    console.log('Analysis file is create!'.green)
  }

  download(type, cachefile, download) {
    if (download) {
      let downjs = './analysis/' + type + '/' + cachefile + '/' + download + '.js'
      if (fs.existsSync(downjs)) {
        let downstr = fs.readFileSync(downjs).toString()
        simg.saveimg(JSON.parse(downstr))
      } else {
        console.log('Mining data is not exist!'.red)
      }
    }
  }

  matchnewarr(oldarr, reg) {
    let temparr = []
    for (let i in oldarr) {
      let res = oldarr[i].match(reg)[2]
      temparr.push(res)
    }
    return temparr
  }
}

module.exports = analysis
