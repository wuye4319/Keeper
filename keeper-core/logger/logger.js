/**
 * Created by nero on 2017/8/9.
 */
let path = require('path')
var writefile = require('./writefile')
writefile = new writefile()

class Logger {
  constructor () {
    this.options = {
      sucfile: '../logfile/success.txt',
      errfile: '../logfile/error.txt'
    }
  }

  writelog (type, str) {
    if (type == 'success') {
      let file = path.join(__dirname, this.options.sucfile)
      writefile.append(file, str)
    } else {
      let file = path.join(__dirname, this.options.errfile)
      writefile.append(file, str)
    }
  }
}

module.exports = Logger
