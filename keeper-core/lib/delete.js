/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const Arrdir = require('./arrdir')
const arrdir = new Arrdir()

// constructor
class Delete {
  // delete source from path
  deleteSource (dir, type) {
    let filename = dir.substr(dir.lastIndexOf('/') + 1)
    let mydir = dir.substr(0, dir.lastIndexOf('/') + 1)
    let dircont = arrdir.arrdir(mydir)

    if (type === 'all') {
      this.deleteAll(dir)
    } else if (fs.existsSync(dir) && filename) {
      this.deletefile(dir)
    }

    return true
  }

  deletefile (dir) {
    fs.unlinkSync(dir)
    console.log(dir.yellow + ' is delete successed!'.green)
  }

  // foreach the path to delete file
  deleteDir (dir) {
    if (fs.existsSync(dir)) {
      // if dir is empty,delete dir.
      if (!fs.readdirSync(dir).length) {
        fs.rmdirSync(dir)
        console.log(dir.yellow + ' dir is delete successed!'.cyan)
      }
    } else {
      console.error('error, '.red + dir + ' is not exist!'.red)
    }
  }

  deleteAll (myfilepath) {
    let that = this
    if (fs.existsSync(myfilepath)) {
      fs.readdir(myfilepath, function (err, paths) {
        if (err) {
          throw err
        }
        paths.forEach(function (path, index) {
          let _myfilepath = myfilepath + path

          fs.stat(_myfilepath, function (err, file) {
            if (err) {
              throw err
            }
            if (file.isFile()) {
              that.deletefile(_myfilepath)
              if (index === paths.length - 1) {
                that.deleteDir(myfilepath)
              }
            } else if (file.isDirectory()) {
              that.deleteAll(_myfilepath + '/')
            }
          })
        })
      })
    }
  }
}

module.exports = Delete
