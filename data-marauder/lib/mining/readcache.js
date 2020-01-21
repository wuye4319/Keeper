let path = require('path')
const fs = require('fs')

const Fswritefile = require('keeper-core/lib/writefile')
let writefile = new Fswritefile()
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()

class readcache {
  constructor () {
    this.options = {
      gpath: '../../../../cache/',
      cacheinfor: '/infor.txt'
    }
  }

  readcache (type) {
    let infor = path.join(__dirname, this.options.gpath + type + this.options.cacheinfor)

    if (fs.existsSync(infor)) {
      let mycacheinfor = fs.readFileSync(infor).toString()
      let temparr = JSON.parse('[' + mycacheinfor + ']')
      // console.log(temparr)
      temparr.reverse()
      return temparr
    }
  }

  cachestr (type, cachefile) {
    let result
    let mypath = path.join(__dirname, this.options.gpath + type + '/' + cachefile[0] + '.html')
    if (fs.existsSync(mypath)) {
      result = fs.readFileSync(mypath).toString()
    }
    return result
  }
}

module.exports = readcache
