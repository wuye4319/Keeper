/**
 * Created by nero on 2018/4/26
 */
// http://www.se8pc.com/thread-9283739-1-11.html
const fs = require('fs')
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

class snav {
  getcont (cont, url, type) {
    cache.writecache(cont, url, type)
  }
}

module.exports = snav
