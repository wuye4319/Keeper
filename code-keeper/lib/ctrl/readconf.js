/**
 * Created by nero on 2017/3/23.
 */
const Fsrules = require('../ctrl/loadconf')
let rules = new Fsrules()

class conf {
  conf (param) {
    if (param.length > 0) {
      let key = param.substr(0, param.indexOf(' '))
      let value = param.substr(param.indexOf(' ') + 1)
      // myinfor.config.myModule = value
      this.readconf()
    } else {
      this.readconf()
    }
  }

  readconf () {
    let myinfor = rules.infor()
    let myconfig = myinfor.config
    let myseo = rules.seoinfor()
    console.log('myModule : \''.green + myconfig.myModule.red + '\''.green)
    console.log('childModule : \''.green + myconfig.childModule.red + '\''.green)
    console.log('currTheme : \''.green + (myconfig.currTheme ? myconfig.currTheme.red : '') + '\''.green)
    console.log('lang : \''.cyan + myconfig.lang.red + '\''.cyan)
    console.log('proxy : \''.cyan + myconfig.proxy.red + '\''.cyan)
    console.log('cn : '.blue)
    console.log(JSON.stringify(myseo[0]).yellow)
    console.log('en : '.blue)
    console.log(JSON.stringify(myseo[1]).yellow)
  }
}

module.exports = conf
