/**
 * Created by nero on 2017/4/5.
 * each dir
 */
const fs = require('fs')
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Render = require('keeper-core/lib/render')
let render = new Render()
const Fsrules = require('../ctrl/loadconf')
let rules = new Fsrules()
const path = require('path')

let routerlist = {'cn': [], 'en': []}

class eachdir {
  // seach all dir under router dir
  seachdir (myfilepath, prepath, lang, type) {
    let myinfor = rules.infor()
    let myconfig = myinfor.config
    let that = this
    let source = myconfig.sourcedir
    let paths = fs.readdirSync(myfilepath)
    !paths || paths.forEach(function (path, index) {
      let _myfilepath = myfilepath + path
      let file = fs.statSync(_myfilepath)
      if (file.isDirectory()) {
        let isSource = source.indexOf(path)
        if (isSource === -1) {
          // same name js file is exist in the dir
          let isndir = (type === 'html' ? fs.existsSync(_myfilepath + '/index.html') : fs.existsSync(_myfilepath + '/' + path + '.js'))
          path = (prepath ? prepath + path : path)
          // out path
          if (isndir) {
            lang === 'en/' ? routerlist.en.push(path) : routerlist.cn.push(path)
          }
          that.seachdir(_myfilepath + '/', path + '/', lang)
        }
      }
    })
  }

  seachdirbykey (key) {
    routerlist = {'cn': [], 'en': []}
    let myinfor = rules.infor()
    let myconfig = myinfor.config
    let lang = myinfor.lang
    for (let i in lang) {
      // each dir name from [router dir]
      if (key === 'js') {
        this.seachdir('./front/' + lang[i] + 'source/js/' + myconfig.myModule + '/', '', lang[i])
      } else {
        this.seachdir('./front/' + lang[i] + 'source/js/' + myconfig.myModule + '/', '', lang[i], 'html')
      }
    }

    // update router list
    // use for .dev[transfile], read /en dir, and contant trans.
    let file = path.join(__dirname, '/../../tpl/routerlist.txt')
    let outfile = path.join(__dirname, '/../../config/routerlist.js')
    let tpl = fs.readFileSync(file).toString()
    let data = {routerlist_cn: JSON.stringify(routerlist.cn), routerlist_en: JSON.stringify(routerlist.en)}
    let str = render.renderdata(tpl, data)
    // write my file And Report
    let newfile = writefile.writejs(outfile, str)
    newfile ? console.log('router list is update!'.green) : console.log('router list is update failed!'.red)

    return routerlist
  }
}

module.exports = eachdir
