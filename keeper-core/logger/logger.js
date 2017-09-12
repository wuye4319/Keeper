/**
 * Created by nero on 2017/8/9.
 */
let path = require('path')
var writefile = require('../lib/writefile')
writefile = new writefile()
const os = require('os')

class Logger {
  constructor () {
    this.options = {
      errfile: '../logfile/error.txt',
      gpath: '../../../success/'
    }
  }

  writelog (type, str) {
    if (type == 'success') {
      // let file = path.join(__dirname, this.options.sucfile)
      let d = new Date()
      if (os.platform() === 'linux') {
        d.setHours(d.getHours() + 13)
      }
      let name = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      let file = path.join(__dirname, this.options.gpath + name + '.txt')
      writefile.append(file, str)
    } else {
      let file = path.join(__dirname, this.options.errfile)
      writefile.append(file, str)
    }
  }
}

module.exports = Logger
