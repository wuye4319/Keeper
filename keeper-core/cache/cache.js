/**
 * Created by nero on 2017/9/7.
 */
let path = require('path')
const fs = require('fs')
const os = require('os')

const Fswritefile = require('../lib/writefile')
let writefile = new Fswritefile()
const Fsdel = require('../lib/delete')
let del = new Fsdel()
const Fslog = require('keeper-core')
let log = new Fslog()

class Cache {
  constructor () {
    this.options = {
      errfile: '../logfile/error.txt',
      gpath: '../../../cache/',
      cacheinfor: '../../../cache/infor.txt',
      update: 10,
      clear: 30
    }
  }

  readcache (url, search) {
    let result = false
    let infor = path.join(__dirname, this.options.cacheinfor)

    if (fs.existsSync(infor)) {
      let mycacheinfor = fs.readFileSync(infor).toString()
      let temparr = JSON.parse('[' + mycacheinfor + ']')
      // console.log(temparr)
      for (var i in temparr) {
        let tmpurl = Object.values(temparr[i])
        let myurl = url.substr(url.indexOf('url=') + 4)
        if (tmpurl[0] === myurl) {
          // delay 10 day
          // date.setDate(date.getDate() - this.options.update)
          let cachefile = Object.keys(temparr[i])
          let mypath = path.join(__dirname, this.options.gpath + cachefile + '.html')
          result = fs.readFileSync(mypath).toString()
          let date = new Date()
          if (os.platform() === 'linux') {
            date.setHours(date.getHours() + 13)
          }
          log.writelog('success', 'Read cache file : ' + cachefile + '.html    ' + date + '.    Search Engines : ' + search + '\n' + url + '\n')
          break
        }
      }
    }

    return result
  }

  // write
  writecache (html, url) {
    let date = new Date()
    if (os.platform() === 'linux') {
      date.setHours(date.getHours() + 13)
    }

    let infor = path.join(__dirname, this.options.cacheinfor)
    let hasinfor = fs.existsSync(infor)
    let str = (hasinfor ? ',\n{"' : '{"') + date.getTime() + '":"' + url.substr(url.indexOf('url=') + 4) + '"}'
    writefile.append(infor, str)

    let file = path.join(__dirname, this.options.gpath + date.getTime() + '.html')
    writefile.writejs(file, html)
    log.writelog('success', 'Create cache file : ' + date.getTime() + '.html\n')
  }

  // clear
  delcache () {
    let mycache = path.join(__dirname, this.options.gpath)
    del.deleteAll(mycache, 'all')
  }
}

module.exports = Cache
