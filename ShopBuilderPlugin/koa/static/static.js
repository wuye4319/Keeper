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
      ctx.response.body = this.addinitdata(ctx, fp)
    } else {
      // Not found
      ctx.response.status = 404
    }
  }

  addinitdata (ctx, fp) {
    // add static data
    let ishtml = /.html/.test(fp)
    let htmlcont
    if (ishtml) {
      let tempstr = fs.readFileSync(fp)

      let user = (ctx.hostname === 'localhost' ? 'testuser' : ctx.hostname)
      let pageindex = ctx.url.indexOf('page')
      let param = ctx.url.split('/')
      let page = (pageindex !== -1 ? param[2] : param[1])
      let data = {}
      let conf = JSON.parse(fs.readFileSync('./shop/' + user + '/themeconf.json').toString())
      let pageconf = './shop/' + user + '/' + conf.currtheme + '/config.json'
      let temp = JSON.parse(fs.readFileSync(pageconf).toString())
      data.page = temp.pages[page]
      data.layout = temp.layout
      data.theme = temp.theme

      htmlcont = tempstr.toString().replace(/<\/body>/, '<script>window.staticinitdata=' + JSON.stringify(data) + '</script>\n</body>')
    } else {
      htmlcont = fs.readFileSync(fp)
    }

    return htmlcont
  }
}

module.exports = staticFiles
