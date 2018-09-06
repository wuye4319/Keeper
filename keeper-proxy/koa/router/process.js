/**
 * Created by nero on 2017/6/2.
 */
const Proxy = require('../../lib/proxy')
let proxy = new Proxy()
const Logger = require('keeper-core')
let logger = new Logger()

const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()

let internumb = 0
let urlbox = []

class ctrl {
  async filter (myurl, rout, datatype) {
    // filter
    logger.myconsole('process : '.red + internumb.toString().red)
    logger.myconsole(myurl)
    let result

    if (internumb > 15) {
      logger.myconsole('Server is busy,please wait...')
      await proxy.close()
      await proxy.init()
      await proxy.initproxybrowser()
      // clear process and url box
      this.clearinternumb()
      await proxy.autoproxy()
    } else {
      // do not cache url
      internumb += 1
      let hasurl = this.eachurl(urlbox, myurl)
      if (hasurl) {
        logger.myconsole('Repeat request!'.red)
      } else {
        urlbox.push(myurl)
        // read cache file time
        let rct = Date.now()
        let hascache = await cache.readcache(myurl, rout)
        rct = Date.now() - rct
        logger.myconsole('read cache time : '.green + rct.toString().red + ' ms'.green)
        if (hascache) {
          result = hascache
          logger.myconsole('this is cache file!')
        } else {
          result = await this.getdatatype(rout, myurl, datatype)
        }

        // rm url in box
        urlbox.splice(hasurl - 1, 1)
        urlbox.length ? logger.myconsole(JSON.stringify(urlbox)) : logger.myconsole('[]')
      }

      internumb -= 1
    }

    return result
  }

  async getdatatype (rout, url, type) {
    switch (type) {
      case 'pipe':
        return proxy.pipedata(rout, url, internumb)
      case 'page':
        return proxy.pagedata(rout, url, internumb)
      case 'url':
        return proxy.urldata(url)
    }
  }

  eachurl (box, url) {
    let result = false
    for (let i in box) {
      if (box[i] === url) result = i + 1
    }
    return result
  }

  clearinternumb () {
    internumb = 0
    urlbox = []
  }
}

module.exports = ctrl
