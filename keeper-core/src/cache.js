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
      cacheinfor: '/infor.txt',
      cachemins: 30 // minutes
    }
  }

  // auto clear cache
  readcache (url, type) {
    return new Promise((resolve) => {
      let result = false
      let infor = path.join(__dirname, this.options.gpath + type + this.options.cacheinfor)

      if (fs.existsSync(infor)) {
        let mycacheinfor = fs.readFileSync(infor).toString()
        let temparr = JSON.parse('[' + mycacheinfor + ']')
        // console.log(temparr)
        temparr.reverse()
        let ruletime = mytime.getdate()
        ruletime.setMinutes(ruletime.getMinutes() - this.options.cachemins)
        ruletime = ruletime.getTime()
        for (let i in temparr) {
          let tmpurl = Object.values(temparr[i])
          let cachefile = Object.keys(temparr[i])
          let mycurrdate = cachefile[0].substr(cachefile[0].indexOf('/') + 1)
          // tempdatearr = tempdatearr.split('-')
          let istrue = (mycurrdate > ruletime ? 1 : 0)
          // In current cache date, if url is exist
          if (istrue) {
            let tempurl = encodeURIComponent(url)
            if (tmpurl[0] === tempurl) {
              let mypath = path.join(__dirname, this.options.gpath + type + '/' + cachefile[0] + '.html')
              if (fs.existsSync(mypath)) {
                result = fs.readFileSync(mypath).toString()
              }
              log.mybuffer({'Read': cachefile + '.html', 'date': mytime.mytime(), 'url': url})
              log.writelog('success', type)
            }
          } else {
            break
          }
        }
      }

      resolve(result)
    })
  }

  // write
  writecache (html, url, type) {
    let date = mytime.getdate()
    let name = mytime.mydate('mins')
    url = encodeURIComponent(url)

    let infor = path.join(__dirname, this.options.gpath + type + '/infor/' + name + '.txt')
    let maininfor = path.join(__dirname, this.options.gpath + type + this.options.cacheinfor)
    this.appendfile(infor, date, url, name)
    this.appendfile(maininfor, date, url, name)

    let file = path.join(__dirname, this.options.gpath + type + '/' + name + '/' + date.getTime() + '.html')
    writefile.writejs(file, html)
    type === 'error' ? log.myconsole('Create error cache file!'.red) : log.myconsole('Create cache file!'.blue)
    log.mybuffer({'Cache': name + '/' + date.getTime() + '.html'})
  }

  appendfile (infor, date, url, name) {
    let hasinfor = fs.existsSync(infor)
    let str = (hasinfor ? ',\n{"' : '{"') + name + '/' + date.getTime() + '":"' + url + '"}'
    writefile.append(infor, str)
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
                let ispass = mytime.dateispass(datearr, keepdate)
                if (ispass) {
                  let mycache = path.join(__dirname, that.options.gpath + type + '/' + dirname + '/')
                  del.deleteSource(mycache, 'all')
                  let myinfor = path.join(__dirname, that.options.gpath + type + '/infor/' + dirname + '.txt')
                  if (fs.existsSync(myinfor)) del.deleteSource(myinfor)
                }
              }
            }
            if (index === paths.length - 1) {
              that.updatecacheinfor(type)
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
