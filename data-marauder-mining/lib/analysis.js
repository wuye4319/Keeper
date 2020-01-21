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
const Rnav = require('../regular/rnav')
let rnav = new Rnav()

class analysis {
  analy (cont, type, cachefile) {
    let rulbox = rnav.rule()
    for (let i in rulbox) {
      let tempobj = cont.match(rulbox[i])
      const imgpath = './analysis/' + type + '/' + cachefile + '/rule' + i + '.js'
      writefile.writejs(imgpath, JSON.stringify(tempobj))
    }
    console.log('Analysis file is create!'.red)
  }
}

module.exports = analysis
