/**
 * Created by nero on 2017/4/5.
 * each dir
 */
const fs = require('fs')
const path = require('path')

class eachdir {
  // seach all dir under router dir
  async dirlist(filepath, except, type, filebase) {
    return new Promise(resolve => {
      let paths = fs.readdirSync(filepath)
      let dirbox = []
      if (paths.length) {
        paths.forEach(function (tempath, index) {
          const has = except ? except.indexOf(tempath) === -1 : true
          let _myfilepath = path.join(filepath, tempath)
          let file = fs.statSync(_myfilepath)
          let is = (type === 'file' ? file.isFile() : file.isDirectory())

          if (is && has) {
            if (filebase) {
              tempath = tempath.split('.')[0]
            }
            dirbox.push(tempath)
          }
          if (index === paths.length - 1) {
            // last file
            resolve(dirbox)
          }
        })
      }
    })
  }

  // async getobj(filepath) {
  //   let objlist = []
  //   let dirlist = await this.dirlist(filepath)
  //   dirlist.forEach(function (dir, index) {
  //     let isobj = path.join(filepath, dir + '/package.json')
  //     if (fs.existsSync(isobj)) {
  //       objlist.push(dir)
  //     }
  //   })

  //   return objlist
  // }
}

module.exports = eachdir
