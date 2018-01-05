/**
 * Created by nero on 2017/3/22.
 *
 */
// release
const fs = require('fs')
const Fsrules = require('../ctrl/loadconf')
let rules = new Fsrules()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

class initrel {
  constructor () {
    this.options = {
      release: './static/release/'
    }
  }

  releaseconf () {
    let release = []
    let confrelease = this.options.release
    let myinfor = rules.infor()
    let lang = myinfor.lang

    for (let i = 0; i < lang.length; i++) {
      let mypathlist = rules.mypath(lang[i])
      // release
      let myrelease = {
        html: mypathlist.stat + mypathlist.html + myinfor.myChildDir,
        outhtml: confrelease + mypathlist.html + myinfor.myChildDir,
        js: mypathlist.stat + mypathlist.js + myinfor.myChildDir,
        outjs: confrelease + mypathlist.js + myinfor.myChildDir,
        img: mypathlist.stat + mypathlist.img + myinfor.myChildDir,
        outimg: confrelease + mypathlist.img + myinfor.myChildDir
      }
      release.push(myrelease)
    }

    return release
  }

  release (param) {
    let confrelease = this.releaseconf()
    let bdimg = false
    if (param === 'img') {
      bdimg = true
    }
    for (let i in confrelease) {
      this.readwrite(confrelease[i].html, confrelease[i].outhtml)
      this.readwrite(confrelease[i].js, confrelease[i].outjs)
      bdimg ? this.readwrite(confrelease[i].img, confrelease[i].outimg) : ''
    }
  }

  readwrite (myfilepath, outfile) {
    let that = this
    fs.readdir(myfilepath, function (err, paths) {
      if (err) {
        throw err
      }
      paths.forEach(function (path) {
        let _myfilepath = myfilepath + path
        let _outfile = outfile + path
        let readable, writable

        fs.stat(_myfilepath, function (err, file) {
          if (err) {
            throw err
          }
          if (file.isFile()) {
            let str = fs.readFileSync(_myfilepath).toString()
            writefile.writejs(_outfile, str)
            // pipe data
            readable = fs.createReadStream(_myfilepath)
            writable = fs.createWriteStream(_outfile)
            readable.pipe(writable)
            readable.on('end', () => {
              console.log(_outfile.yellow + ' is ready!'.green)
            })
            readable.on('error', (err) => {
              console.log('error occur in read file'.red)
            })
          } else if (file.isDirectory()) {
            that.readwrite(_myfilepath + '/', _outfile + '/')
          }
        })
      })
    })
  }
}

module.exports = initrel
