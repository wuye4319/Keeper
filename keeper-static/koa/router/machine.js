/**
 * machine
 * get current information for prerender
 */
const path = require('path')
const systemconfig = require('../../config/system')
let fs = require('fs')
const Proxy = require('../../lib/proxy')
let proxy = new Proxy()
const Writefile = require('../../base/writefile')
let writefile = new Writefile()
const Del = require('../../base/delete')
let del = new Del()

class machine {
  async init () {
    // await this.clear()
    let imgbox = [
      '../../../../static/source/img/warmachine/codeimg/.gitkeep',
      '../../../../static/source/img/warmachine/loginacc/acc.txt'
    ]
    let initimg = path.join(__dirname, '/../../tpl/img/.gitkeep')
    for (let i in imgbox) {
      // if (!fs.existsSync(imgbox[i])) {
      let str = fs.readFileSync(initimg).toString()
      let initdir = path.join(__dirname, imgbox[i])
      writefile.writejs(initdir, str)
      // }
    }
  }

  async clearimg () {
    let myfilepath = path.join(__dirname, '../../../../static/source/img/warmachine/loginacc/')
    if (fs.existsSync(myfilepath)) {
      fs.readdir(myfilepath, function (err, paths) {
        if (err) throw err
        if (paths.length) {
          paths.forEach(function (path, index) {
            let _myfilepath = myfilepath + path

            fs.stat(_myfilepath, function (err, file) {
              if (err) throw err
              if (file.isFile()) del.deletefile(_myfilepath)
            })
          })
        }
      })
    }
  }

  async getdata () {
    let data = {proxy: [], proxyacc: false, browser: []}
    // let iplist = proxy.getproxylist()
    // for (let i in iplist) {
    //   let temp = {}
    //   temp.ip = iplist[i].address
    //   data.proxy.push(temp)
    // }
    let numb = systemconfig.browsernumb

    // version
    let tempver = fs.readFileSync(path.join(__dirname, '/../../package.json')).toString()
    data.vers = JSON.parse(tempver).version

    // acc
    let file = path.join(__dirname, '../../../../static/source/img/warmachine/loginacc/acc.txt')
    let acc = fs.readFileSync(file).toString()
    acc = JSON.parse(acc)
    if (acc['bcurr']) {
      data.proxyacc = acc['bcurr']
    }
    for (let i = 0; i < numb; i++) {
      let tempobj = {}
      if (acc['bself' + i]) {
        tempobj.loginacc = acc['bself' + i]
      } else {
        tempobj.loginacc = false
      }
      data.browser.push(tempobj)
      // let imgname = 'loginstatusself' + i + '.png'
      // let loginstatus = './static/source/img/warmachine/loginacc/' + imgname
      // if (fs.existsSync(loginstatus)) {
      //   // this.getcurracc(i, imgname)
      //   tempobj.loginacc = imgname
      // } else {
      //   tempobj.loginacc = false
      // }
    }
    data.proxystatus = proxy.getproxystatus()
    return data
  }
}

module.exports = machine
