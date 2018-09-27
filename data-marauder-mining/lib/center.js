let path = require('path')
const fs = require('fs')
const ReadCache = require('./readcache')
let cache = new ReadCache()
const Analysis = require('./analysis')
let analysis = new Analysis()

class ctrol {
  getdata (type) {
    let temparr = cache.readcache(type)
    for (let i in temparr) {
      // let tmpurl = Object.values(temparr[i])
      let cachefile = Object.keys(temparr[i])
      // let mycurrdate = cachefile[0].substr(cachefile[0].indexOf('/') + 1)
      // tempdatearr = tempdatearr.split('-')
      // In current cache date, if url is exist
      let data = cache.cachestr(type, cachefile)
      analysis.analy(data, type, cachefile)
    }
  }
}

module.exports = ctrol