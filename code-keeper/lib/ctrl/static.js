/**
 * Created by nero on 2017/3/22.
 *
 */
const fs = require('fs')
var mystatic = require('../base/static')
mystatic = new mystatic()

const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

class Static {
  // reset all except myjs
  jsStr (file, data) {
    var content = fs.readFileSync(file).toString()
    var firstStr = '<!-- business logic js -->'
    var secStr = 'src='
    var endStr = '></script>'
    var contstr01 = content.substr(content.indexOf(firstStr) + firstStr.length)
    var contstr = contstr01.substr(contstr01.indexOf(secStr) + secStr.length + 1)
    var newjs = contstr.substr(0, contstr.indexOf(endStr) - 1)
    return newjs
  }

  hascont (str, content) {
    var strn = str + '\n'
    var strr = str + '\r'
    var strnr = str + '\r\n'
    if (content.indexOf(strn) != -1) {
      return content.indexOf(strn) + strn.length
    } else if (content.indexOf(strnr) != -1) {
      return content.indexOf(strnr) + strnr.length
    } else if (content.indexOf(strr) != -1) {
      return content.indexOf(strr) + strr.length
    }
  }

  // reset all except content between container and body
  contstr (file, data) {
    var content = fs.readFileSync(file).toString()
    var firstStr = '<body>'
    var endStr = '<div id="container"'
    // windows \r\n
    var hascont = this.hascont(firstStr, content)
    var contstr01 = content.substr(hascont)
    var newstr = contstr01.substr(0, contstr01.indexOf(endStr))
    return newstr
  }

  static (Prompt, param) {
    var self = this
    // init html
    var mydatafile = []
    mydatafile.push(myrules.init[1])
    myrules.init[5] ? mydatafile.push(myrules.init[5]) : ''
    for (var i = 0; i < mydatafile.length; i++) {
      var file = mydatafile[i].filename
      var tpl = fs.readFileSync(mydatafile[i].template).toString()
      var data = mydatafile[i].data
      var str
      // keep old content
      if (fs.existsSync(file)) {
        data.myjs = self.jsStr(file, data)
        data.container = self.contstr(file, data) + data.container
      }
      // render
      str = render.renderdata(tpl, data)
      // write my file And Report
      var newfile = writefile.writejs(mydatafile[i].filename, str)
      newfile ? console.log(mydatafile[i].filename.yellow + ' is init success!'.green) : console.log(mydatafile[i].filename.yellow + ' is init failed!'.cyan)
      console.log(mydatafile[i].filename.yellow + ' is ready to complete!'.magenta + ' please wait......'.rainbow)

      mystatic.staticpage(mydatafile[i].filename, mydatafile[i].proxyname, Prompt, param)
    }
  }
}

module.exports = Static
