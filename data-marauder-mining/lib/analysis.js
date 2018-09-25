/**
 * Created by nero on 2018/4/26
 */
// http://www.se8pc.com/thread-9283739-1-11.html
const fs = require('fs')
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Dataurl = require('../lib/url')
let dataurl = new Dataurl()
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

  saveimg (imgdatabox) {
    if (imgdatabox) {
      const imgpath = './testimg/' + mytime.mydate('mins') + '/'
      const initstr = imgpath + 'init.txt'
      if (!fs.existsSync(initstr)) {
        writefile.writejs(initstr, '123')
      }

      for (let i in imgdatabox) {
        let erg2 = /\s(file|src|zoomfile)="(.+)"/
        // console.log(imgdatabox[i])
        let imgurl = imgdatabox[i].match(erg2)[2]
        // console.log(imgurl)
        // let imgname = imgurl.match(/\w+(.jpg|.png)/)
        let imgtype = imgurl.match(/.jpg|.png/)[0]

        // console.log(i, imgtype, imgname)
        if (imgurl) dataurl.saveimg(imgurl, imgpath + i + imgtype)
      }
    }
  }
}

module.exports = analysis
