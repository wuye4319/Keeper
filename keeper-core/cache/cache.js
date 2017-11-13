/**
 * Created by nero on 2017/9/7.
 */
let path = require('path')
const fs = require('fs')

const Fswritefile = require('../lib/writefile')
let writefile = new Fswritefile()
const Fsdel = require('../lib/delete')
let del = new Fsdel()
const Fslog = require('keeper-core')
let log = new Fslog()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()

class Cache {
  constructor () {
    this.options = {
      errfile: '../logfile/error.txt',
      gpath: '../../../cache/',
      cacheinfor: '/infor.txt'
    }
  }

  readcache (url, search, type) {
    let result = false
    let infor = path.join(__dirname, this.options.gpath + type + this.options.cacheinfor)

    if (fs.existsSync(infor)) {
      let mycacheinfor = fs.readFileSync(infor).toString()
      let temparr = JSON.parse('[' + mycacheinfor + ']')
      // console.log(temparr)
      for (var i in temparr) {
        let tmpurl = Object.values(temparr[i])
        if (tmpurl[0] === url) {
          let cachefile = Object.keys(temparr[i])
          let mypath = path.join(__dirname, this.options.gpath + type + '/' + cachefile + '.html')
          if (fs.existsSync(mypath)) {
            result = fs.readFileSync(mypath).toString()
          }
          log.writelog('success', '{"Read":"' + cachefile + '.html","date":"' + mytime.mytime() + '","Engines":"' + search + '","url":"' + url + '"}', type)
          break
        }
      }
    }

    return result
  }

  // write
  writecache (html, url, type) {
    let date = mytime.getdate()
    let name = mytime.mydate()

    let infor = path.join(__dirname, this.options.gpath + type + '/infor/' + name + '.txt')
    let maininfor = path.join(__dirname, this.options.gpath + type + this.options.cacheinfor)
    this.appendfile(infor, date, url, name)
    this.appendfile(maininfor, date, url, name)

    let file = path.join(__dirname, this.options.gpath + type + '/' + name + '/' + date.getTime() + '.html')
    writefile.writejs(file, html)
    console.log('Create cache file!'.yellow)
    return '"Cache":"' + name + '/' + date.getTime() + '.html",'
  }

  appendfile (infor, date, url, name) {
    let hasinfor = fs.existsSync(infor)
    let str = (hasinfor ? ',\n{"' : '{"') + name + '/' + date.getTime() + '":"' + url + '"}'
    writefile.append(infor, str)
  }

  dateispass (datearr, keepdate) {
    let ruletime = new Date()
    ruletime.setDate(ruletime.getDate() - keepdate)
    ruletime = ruletime.getTime()

    let date = new Date()
    date.setYear(datearr[0])
    date.setMonth(datearr[1] - 1)
    date.setDate(datearr[2])
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date = date.getTime()

    if (date < ruletime) {
      return true
    } else {
      return false
    }
  }

  // clear
  delcache (type, keepdate) {
    let that = this
    let myfilepath = path.join(__dirname, this.options.gpath + type + '/')
    if (fs.existsSync(myfilepath)) {
      fs.readdir(myfilepath, function (err, paths) {
        if (err) throw err
        paths.forEach(function (dirname, index) {
          let _myfilepath = myfilepath + dirname
          fs.stat(_myfilepath, function (err, file) {
            if (err) throw err
            if (file.isDirectory()) {
              let datearr = dirname.split('-')
              if (datearr.length > 2) {
                let ispass = that.dateispass(datearr, keepdate)
                if (ispass) {
                  let mycache = path.join(__dirname, that.options.gpath + type + '/' + dirname + '/')
                  del.deleteSource(mycache, 'all')
                  let myinfor = path.join(__dirname, that.options.gpath + type + '/infor/' + dirname + '.txt')
                  if (fs.existsSync(myinfor)) del.deleteSource(myinfor)
                }
              }
            }
          })
        })
      })
    } else {
      console.log('dir is not exist!'.red)
    }
  }

  updatecacheinfor (type) {
    let that = this
    if (!type) type = 'buy'
    let myfilepath = path.join(__dirname, this.options.gpath + type + '/infor/')
    let tempstr = ''
    if (fs.existsSync(myfilepath)) {
      fs.readdir(myfilepath, function (err, paths) {
        if (err) throw err
        paths.forEach(function (dirname, index) {
          let _myfilepath = myfilepath + dirname
          fs.stat(_myfilepath, function (err, file) {
            if (err) throw err
            if (file.isFile()) {
              tempstr = (tempstr ? tempstr + ',\n' : '') + fs.readFileSync(_myfilepath)
              if (index === paths.length - 1) {
                // console.log(tempstr)
                let file = path.join(__dirname, that.options.gpath + type + that.options.cacheinfor)
                writefile.writejs(file, tempstr)
                console.log(file.yellow + ' is update!'.green)
              }
            }
          })
        })
      })
    } else {
      console.log('dir is empty!'.red)
    }
  }
}

module.exports = Cache
