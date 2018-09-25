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
  analy (cont, url, type) {
    let imgdatabox = []
    let rulbox = rnav.rule()
    for (let i in rulbox) {
      let tempobj = {}
      tempobj['rule' + (i + 1)] = cont.match(rulbox[i])
      imgdatabox.push(tempobj)
    }

    const imgpath = './testimg/' + mytime.mydate('mins') + '/'
    writefile.writejs(imgpath, imgdatabox)
    return imgdatabox
  }
}

module.exports = analysis
