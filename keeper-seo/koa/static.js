/**
 * Created by nero on 2017/5/24.
 */
const path = require('path')
// const mime = require('mime')
const fs = require('fs')

// url: '/static/'
// dir: __dirname + '/static'
function staticFiles (url, dir) {
  return async (ctx, next) => {
    let rpath = ctx.request.path
    if (rpath.startsWith(url)) {
      let fp = path.join(dir, rpath.substring(url.length))
      if (fs.existsSync(fp)) {
        // ctx.response.type = mime.lookup(rpath)
        ctx.response.body = fs.readFileSync(fp)
      } else {
        ctx.response.status = 404
      }
    } else {
      await next()
    }
  }
}

module.exports = staticFiles
