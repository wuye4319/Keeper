let path = require('path')
const fs = require('fs')
const ReadCache = require('./readcache')
let cache = new ReadCache()
const Analysis = require('./analysis')
let analysis = new Analysis()

class ctrol {
  getdata(type, isdownload) {
    let temparr = cache.readcache(type)
    for (let i in temparr) {
      // let tmpurl = Object.values(temparr[i])
      let cachefile = Object.keys(temparr[i])
      // let mycurrdate = cachefile[0].substr(cachefile[0].indexOf('/') + 1)
      // tempdatearr = tempdatearr.split('-')
      // In current cache date, if url is exist
      if (isdownload) {
        analysis.download(type, cachefile, isdownload)
      } else {
        let data = cache.cachestr(type, cachefile)
        analysis.analy(data, type, cachefile)
      }
    }
  }

  analyprolist(type, isdownload) {
    let temparr = cache.readcache(type)
    for (let i in temparr) {
      // let tmpurl = Object.values(temparr[i])
      let cachefile = Object.keys(temparr[i])
      // let mycurrdate = cachefile[0].substr(cachefile[0].indexOf('/') + 1)
      // tempdatearr = tempdatearr.split('-')
      // In current cache date, if url is exist

      let data = cache.cachestr(type, cachefile)
      data = JSON.parse(data)
      let resultList = data.model.recommend.resultList
      for (let i in resultList) {
        console.log(resultList[i])
      }
    }
  }
}

module.exports = ctrol