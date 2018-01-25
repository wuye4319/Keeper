/**
 * Created by nero on 2017/3/23.
 */
let fs = require('fs')
const Fsrules = require('../ctrl/loadconf')
let rules = new Fsrules()

class myvers {
  constructor () {
    this.options = {
      version: '1.2.0'
    }
  }

  // version of rules.js, not config.js
  vers () {
    let version = this.options.version
    console.log('version:'.green + version.green)
  }

  checkconf () {
    let myinfor = rules.infor()
    let versconf = myinfor.config.version
    let configcheck = [
      {name: 'basepath', value: myinfor.config.basepath},
      {name: 'htmlbasepath', value: myinfor.config.htmlbasepath},
      {name: 'lang', value: myinfor.lang},
      {name: 'wrapper', value: myinfor.config.wrapper.substr(0, myinfor.config.wrapper.lastIndexOf('/'))}
    ]
    let result = true
    if (versconf !== this.options.version) {
      console.log('!!! Warnning : Your config.js is not the latest version, Please create a new config.js buy \'.initconf\','.red)
      result = false
    }
    if (myinfor.config.transfile.trim() === '') {
      console.log('Warning : transfile can\'t be empty!'.red)// transfile
    }
    for (let i in configcheck) {
      if (configcheck[i].value) {
        let dirpath = './static/' + myinfor.lang[0] + (configcheck[i].name === 'lang' ? '' : configcheck[i].value + '/')
        let isexist = fs.existsSync(dirpath)
        isexist || console.log('Warning : '.yellow + configcheck[i].name.green + ' is non-existing dir! Please comfirm.'.yellow)
      }
    }
    return result
  }
}

module.exports = myvers
