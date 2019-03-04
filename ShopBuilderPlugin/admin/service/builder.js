/**
 * Created by nero on 2017/6/2.
 */
const fs = require('fs')
const path = require('path')
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

class builder {
  getpageconfig (user) {
    let data = {}
    let conf = JSON.parse(fs.readFileSync('./shop/' + user + '/themeconf.json').toString())
    let pageconf = './shop/' + user + '/' + conf.currtheme + '/config.json'
    if (fs.existsSync(pageconf)) {
      data = JSON.parse(fs.readFileSync(pageconf).toString())
      return data
    } else {
      return 'params error!'
    }
  }

  editpageconfig (user, pagestr) {
    let res
    let conf = JSON.parse(fs.readFileSync('./shop/' + user + '/themeconf.json').toString())
    let fspageconf = './shop/' + user + '/' + conf.currtheme + '/config.json'

    if (this.checksavestr(pagestr)) {
      res = writefile.writejs(fspageconf, JSON.stringify(pagestr))
      return 'success'
    } else {
      return 'failed'
    }
  }

  checksavestr (obj) {
    // obj = JSON.parse(obj)
    let isjsonstr = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
    return isjsonstr
  }
}

module.exports = builder
