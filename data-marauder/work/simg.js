/**
 * Created by nero on 2018/4/26
 */
// http://www.se8pc.com/thread-9283739-1-11.html

const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Dataurl = require('../lib/url')
let dataurl = new Dataurl()

class simg {
  getcont (cont, url, type) {
    // cache.writecache(cont, url, type)
    let erg = /<img\sid="\w+"\said="\w+"\ssrc=".+"\szoomfile=".+"\sfile=/g
    let imgdatabox = cont.match(erg)

    const imgpath = './testimg/'
    for (let i in imgdatabox) {
      let erg2 = /zoomfile="(.+)"/
      let imgurl = imgdatabox[i].match(erg2)[1]
      // console.log(imgurl)
      let imgname = imgurl.match(/\w+(.jpg|.png)/)
      // console.log(imgname)
      dataurl.saveimg(imgurl, imgpath + imgname[0])
    }
  }

  // async downloadimg (res) {
  //   let reg = /.jpg|.jpeg|.png$/
  //   if (reg.test(res.url())) {
  //     let imgname = res.url().match(/\w+(.png|.jpg)/g)[0]
  //     console.log(imgname.green)
  //     try {
  //       const buffer = await res.buffer()
  //       fs.writeFileSync('./testimg/' + imgname, buffer)
  //     }
  //     catch (e) {
  //       console.log('get simg failed! '.red + e)
  //       throw e
  //     }
  //   }
  // }
}

module.exports = simg
