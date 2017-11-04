/**
 * Created by nero on 2017/10/25.
 */
const fs = require('fs')
const path = require('path')
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()

let transfile, transfilenumb = 0

class proter {
  constructor () {
    this.options = {
      lessdir: '/../../../../front/cn/source/less/',
      trans: '/../../../../front/en/source/js/',
      transfile: '/../../../../static/trans/trans.json'
    }

    transfile = path.join(__dirname, this.options.transfile)
    if (fs.existsSync(transfile)) {
      del.deleteSource(transfile)
    }
  }

  moveless (myfilepath) {
    let mydir = path.join(__dirname, this.options.lessdir)
    this.eachdir(mydir)
    console.log('111')
  }

  trans () {
    let mydir = path.join(__dirname, this.options.trans)
    this.eachdir(mydir)
    console.log(transfilenumb + 'trans files has been count!'.green)
  }

  eachdir (myfilepath) {
    let that = this
    if (fs.existsSync(myfilepath)) {
      let paths = fs.readdirSync(myfilepath)
      paths.forEach(function (filename, index) {
        let _myfilepath = myfilepath + filename

        let file = fs.statSync(_myfilepath)
        if (file.isFile() && filename === 'trans.json') {
          transfilenumb += 1
          let str = fs.readFileSync(_myfilepath).toString()
          _myfilepath = path.normalize(_myfilepath)
          let frontpath = _myfilepath.substr(0, _myfilepath.indexOf('\\trans\\trans.json'))
          let transdirname = frontpath.substr(frontpath.indexOf('\\js\\') + 4)
          transdirname = transdirname.split('\\').join('-')
          str = fs.existsSync(transfile) ? ',"' + transdirname + '":' + str.trim() : '{"' + transdirname + '":' + str.trim()
          writefile.append(transfile, str)
        } else if (file.isDirectory()) {
          that.eachdir(_myfilepath + '/')
        }
      })
    }
  }
}

module.exports = proter
