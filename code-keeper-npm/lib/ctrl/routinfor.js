/**
 * Created by nero on 2019/3/29.
 */
const fs = require('fs')
const path = require('path')

class rulinit {
  constructor() {
    this.option = {

    }
  }

  routinfor(routpath, pagename, title, action) {
    let fsrout = path.resolve(routpath)
    let newroutlist = []

    if (fs.existsSync(fsrout)) {
      let oldrout = fs.readFileSync(fsrout).toString()
      let temprout = oldrout.replace(/export default/, 'module.exports=')
      temprout = eval(temprout)
      for (let i in temprout) {
        let infor = {
          name: temprout[i].name,
          title: temprout[i].meta.title,
          comp: i == 0 ? 'index' : temprout[i].name,
          action: action
        }
        newroutlist.push(infor)
      }
    }

    newroutlist.push({ name: pagename, action: action, title: title, comp: pagename })
    return { routlist: newroutlist }
  }

  delrout(routpath, pagename) {
    let fsrout = path.resolve(routpath)
    let temprout

    if (fs.existsSync(fsrout)) {
      let oldrout = fs.readFileSync(fsrout).toString()
      temprout = oldrout.replace(/export default/, 'module.exports=')
      temprout = eval(temprout)

      for (let i in temprout) {
        if (temprout[i].name === pagename) {
          temprout.splice(i, 1)
        }
      }
    }

    return { routlist: temprout }
  }
}

module.exports = rulinit
