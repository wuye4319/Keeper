/**
 * Created by nero on 2017/3/21.
 * clear files
 * * * *
 * if config.js changed, please reload.
 * we execute rules.js only in the reload.
 * require execute only one times.
 */
const Myctrlinit = require('./init')
let myctrlinit = new Myctrlinit()
const Del = require('keeper-core/lib/delete')
let del = new Del()
const Fsrules = require('../ctrl/loadconf')
let rules = new Fsrules()
let myinfor = rules.infor()

class clear {
  clear (param) {
    if (param === 'r') {
      del.deleteSource('./static/release/', 'r')
    } else {
      // write file
      let confdel = this.delete()
      for (let i in confdel) {
        let mydata = confdel[i]
        del.deleteSource(mydata.filename)
      }
    }

    let isrouter = myinfor.isrouter
    // update router.txt
    isrouter === -1 || myctrlinit.initrout()
  }

  delete () {
    let lang = myinfor.lang
    let arrdel = []
    for (let i = 0; i < lang.length; i++) {
      let mypathlist = rules.mypath(lang[i])
      // delete
      arrdel.push(
        // ./static/cn/source/img/test/.gitkeep
        {filename: mypathlist.stat + mypathlist.img + myinfor.myChildDir + '.gitkeep'},
        {filename: mypathlist.stat + mypathlist.html + myinfor.myChildDir + 'index.html'},
        // ./front/cn/source/js/test/test.js
        {filename: './front/' + mypathlist.js + myinfor.myChildDir + myinfor.mySource + '.js'},
        {filename: './front/' + mypathlist.less + myinfor.myChildDir + myinfor.mySource + '.less'},
        {filename: mypathlist.stat + mypathlist.js + myinfor.myChildDir + myinfor.mySource + '.js'},
        {filename: mypathlist.stat + mypathlist.js + myinfor.myChildDir + myinfor.mySource + '.part.js'})
    }
    return arrdel
  }
}

module.exports = clear
