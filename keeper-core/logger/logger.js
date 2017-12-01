/**
 * Created by nero on 2017/8/9.
 */
let path = require('path')
let fs = require('fs')
const Writefile = require('../lib/writefile')
let writefile = new Writefile()
const Mytime = require('../lib/time')
let mytime = new Mytime()

let startdate = mytime.mydate()

class Logger {
  constructor () {
    this.options = {
      errfile: '../logfile/error.txt',
      gpath: '../../../success/',
      glog: '../../../logger/'
    }
  }

  mybuffer (logkey, logvalue) {
    let tempobj = {}
    tempobj[logkey] = logvalue
    return tempobj
  }

  myconsole (str) {
    let file = path.join(__dirname, this.options.glog + startdate + '.txt')
    writefile.append(file, str + '\n')
  }

  writelog (type, str, mymodule) {
    if (type === 'success') {
      // let file = path.join(__dirname, this.options.sucfile)

      let name = mytime.mydate()
      let file = path.join(__dirname, this.options.gpath + mymodule + '/' + name + '.txt')
      if (fs.existsSync(file)) str = ',\n' + str
      writefile.append(file, str)
    } else {
      let file = path.join(__dirname, this.options.errfile)
      writefile.append(file, str)
    }
  }
}

module.exports = Logger
