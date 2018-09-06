/**
 * Created by nero on 2017/5/24.
 */
const path = require('path')
const mime = require('mime')
const fs = require('fs')

class staticFiles {
  async getfile (ctx, url, dir) {
    let rpath = ctx.request.path
    // file path
    let fp = path.join(dir, rpath)
    if (fs.existsSync(fp)) {
      // console.log(rpath, fp)
      let stats = await fs.statSync(fp)
      if (stats.isDirectory()) {
        let isend = /[\\/]$/.test(fp)
        if (!isend) fp += '/'
        fp += 'index.html'
      }
      ctx.response.type = mime.getType(fp)
      ctx.response.body = fs.readFileSync(fp)
    } else {
      // Not found
      ctx.response.status = 404
    }
  }
}

module.exports = staticFiles
