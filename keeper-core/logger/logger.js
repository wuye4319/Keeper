/**
 * Created by nero on 2017/8/9.
 */
const path = require('path')
const fs = require('fs')
const Writefile = require('../lib/writefile')
let writefile = new Writefile()
const Mytime = require('../lib/time')
let mytime = new Mytime()

let startdate = mytime.mydate()
let buffobj = {}

class Logger {
  constructor () {
    this.options = {
      errfile: '../logfile/error.txt',
      gpath: '../../../success/',
      glog: '../../../logger/'
    }
  }

  mybuffer (obj) {
    Object.assign(buffobj, obj)
  }

  myconsole (str) {
    let file = path.join(__dirname, this.options.glog + startdate + '.txt')
    writefile.append(file, str + '\n')
  }

  startdate () {
    return startdate
  }

  writelog (type, mymodule) {
    if (type === 'success') {
      // let file = path.join(__dirname, this.options.sucfile)
      let strobj = JSON.stringify(buffobj)

      let name = mytime.mydate()
      let file = path.join(__dirname, this.options.gpath + mymodule + '/' + name + '.txt')
      if (fs.existsSync(file)) strobj = ',\n' + strobj
      writefile.append(file, strobj)
    }

    // clear strobj
    buffobj = {}
  }
}

module.exports = Logger
