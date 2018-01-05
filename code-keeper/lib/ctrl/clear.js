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

class clear {
  clear (param) {
    if (param === 'r') {
      del.deleteSource('./static/release/', 'r')
    } else {
      // write file
      let confdel = this.delete()
      for (var i in confdel) {
        var mydata = confdel[i]
        del.deleteSource(mydata.filename)
      }
    }

    let isrouter = myinfor.isrouter
    // update router.txt
    isrouter === -1 || myctrlinit.initrout()
  }

  delete () {
    let lang = myinfor.lang
    let mypathlist = myinfor.mypathlist
    let arrdel = []
    for (let i = 0; i < lang.length; i++) {
      // delete
      arrdel.push(
        {filename: mypathlist[i].statimg},
        {filename: mypathlist[i].stathtml},
        {filename: mypathlist[i].frtjs},
        {filename: mypathlist[i].frtless},
        {filename: mypathlist[i].statjs},
        {filename: mypathlist[i].statpart})
    }
    return arrdel
  }
}

module.exports = clear
