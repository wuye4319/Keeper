/**
 * Created by nero on 2017/8/9.
 */
const path = require('path')
const fs = require('fs')
const Writefile = require('./writefile')
let writefile = new Writefile()
const Mytime = require('./time')
let mytime = new Mytime()

let startdate = mytime.mydate()
let buffobj = {}

class Logger {
  constructor () {
    this.options = {
      errfile: '../logfile/error.txt',
      gpath: '../../../success/',
      glog: '../../../logger/',
      weblog: 'log1'
    }
  }

  mybuffer (obj) {
    Object.assign(buffobj, obj)
  }

  myconsole (str, type) {
    if (type === 'web') {
      let file = './weblog/' + this.options.weblog + '.txt'
      writefile.append(file, str + '\n')
      fs.stat(file, (err, stats) => {
        if (err) throw err
        if (stats.size > 10000) {
          writefile.writejs(file, '')
        }
      })
    } else {
      let rule = /(\[32m)+/
      // console.log(str.match(rule))
      let file = path.join(__dirname, this.options.glog + startdate + '.txt')
      writefile.append(file, str + '\n')
    }
  }

  getweblog () {
    return this.options.weblog
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
