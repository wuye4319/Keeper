/**
 * Created by nero on 2017/3/23.
 */
const path = require('path')
const fs = require('fs')
const Render = require('keeper-core/lib/render')
let render = new Render()
const Fsinit = require('../rules/init-rout')
let rulinit = new Fsinit()
let myrules = rulinit.init()

const Fseachdir = require('../base/eachdir')
let eachdir = new Fseachdir()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Fsrules = require('../ctrl/loadconf')
let rules = new Fsrules()
let myinfor = rules.infor()

class Init {
  // init config.js and seoinfor.json
  initconf (type) {
    let inconf
    let outconf
    if (type === '-a') {
      inconf = path.join(__dirname, '/../../tpl/system/config-admin.js')
      outconf = './config.js'
    } else {
      inconf = path.join(__dirname, '/../../tpl/system/config-front.js')
      outconf = './config.js'
    }
    let res = writefile.copy(inconf, outconf)
    if (res) {
      console.log('config is init success!'.green)
    }
  }

  // init file
  init () {
    // write file
    this.writeinitfile(myrules.init)

    let isrouter = myinfor.isrouter
    // update router.txt
    isrouter === -1 || this.initrout()
  }

  // init router
  initrout () {
    // each all dir by js file, put it on config/routerlist.js
    let routerlist = eachdir.seachdirbykey('js')

    let myroutlist = rulinit.routelist(routerlist)
    // router dir .js
    this.writeinitfile(myroutlist)
    // routername.js
    this.writeroutname(myroutlist)
  }

  // rewrite routername.js
  writeroutname (data) {
    let init = data
    let templ = path.join(__dirname, '/../../tpl/routername.txt')
    // routername write 2 times,but result is different.we need merge those result.
    for (let i in init) {
      let mydata = init[i]
      let tpl = fs.readFileSync(templ).toString()
      let data = mydata.rnamedata
      let str = render.renderdata(tpl, data)
      // write my file And Report
      let newfile = writefile.writejs(mydata.rfname, str)
      newfile ? console.log(mydata.rfname.yellow + ' is update success!'.green) : console.log(mydata.rfname.red + ' is failed to update!'.red)
    }
  }

  // rewrite file [router].js
  writeinitfile (data) {
    let init = data
    for (let i in init) {
      let mydata = init[i]
      let tpl = fs.readFileSync(mydata.template).toString()
      let data = mydata.data
      let str = render.renderdata(tpl, data)
      // write my file And Report
      let newfile = writefile.writejs(mydata.filename, str)
      newfile ? console.log(mydata.filename.yellow + ' is init success!'.green) : console.log(mydata.filename.yellow + ' is init failed!'.red)
    }
  }
}

module.exports = Init
