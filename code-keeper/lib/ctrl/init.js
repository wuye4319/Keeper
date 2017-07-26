/**
 * Created by nero on 2017/3/23.
 */
var fsinit = require('../rules/init')
rulinit = new fsinit()

var fseachdir = require('../base/eachdir')
var eachdir = new fseachdir()

myrules = rulinit.init()

var writefile = require('../base/writefile')
writefile = new writefile()

class Init {
    // init config.js and seoinfor.json
  initconf (type) {
    if (type == '-a') {
      var inconf = __dirname + '/../../tpl/system/config-admin.js'
      var outconf = './config.js'
    } else {
      var inconf = __dirname + '/../../tpl/system/config-front.js'
      var outconf = './config.js'
    }
    var res = writefile.copy(inconf, outconf)
    if (res) {
      console.log('config is init success!'.green)
    }
  }

    // init file
  init () {
        // write file
    this.writeinitfile(myrules.init)

    var isrouter = myinfor.isrouter
        // update router.txt
    isrouter == -1 || this.initrout()
  }

    // init router
  initrout () {
    var routerlist = eachdir.seachdirbykey('js')

    var myroutlist = rulinit.routelist(routerlist)
        // router dir .js
    this.writeinitfile(myroutlist)
        // routername.js
    this.writeroutname(myroutlist)
  }

    // rewrite routername.js
  writeroutname (data) {
    var init = data
    var templ = __dirname + '/../../tpl/routername.txt'
        // routername write 2 times,but result is different.we need merge those result.
    for (var i in init) {
      var mydata = init[i]
      var tpl = fs.readFileSync(templ).toString()
      var data = mydata.rnamedata
      var str = render.renderdata(tpl, data)
            // write my file And Report
      var newfile = writefile.writejs(mydata.rfname, str)
      newfile ? console.log(mydata.rfname.yellow + ' is update success!'.green) : console.log(mydata.rfname.red + ' is failed to update!'.red)
    }
  }

    // rewrite file [router].js
  writeinitfile (data) {
    var init = data
    for (var i in init) {
      var mydata = init[i]
      var tpl = fs.readFileSync(mydata.template).toString()
      var data = mydata.data
      var str = render.renderdata(tpl, data)
            // write my file And Report
      var newfile = writefile.writejs(mydata.filename, str)
      newfile ? console.log(mydata.filename.yellow + ' is init success!'.green) : console.log(mydata.filename.yellow + ' is init failed!'.red)
    }
  }
}

module.exports = Init
