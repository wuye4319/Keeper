/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
var fs = require('fs')
var fsarrdir = require('./arrdir')
var arrdir = new fsarrdir()

// constructor
class Delete {
  // delete source from path
  deleteSource (dir, type) {
    var filename = dir.substr(dir.lastIndexOf('/') + 1)
    var mydir = dir.substr(0, dir.lastIndexOf('/') + 1)
    var dircont = arrdir.arrdir(mydir)

    if (fs.existsSync(dir) && filename) {
      this.deletefile(dir)
    }

    if (type == 'r') {
      this.deleteAll(dir)
    } else {
      for (var d in dircont) {
        this.deleteDir(dircont[d])
      }
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
    var that = this
    if (fs.existsSync(myfilepath)) {
      fs.readdir(myfilepath, function (err, paths) {
        if (err) {
          throw err
        }
        paths.forEach(function (path, index) {
          var _myfilepath = myfilepath + path

          fs.stat(_myfilepath, function (err, file) {
            if (err) {
              throw err
            }
            if (file.isFile()) {
              that.deletefile(_myfilepath);
              (index == paths.length - 1) ? that.deleteSource(myfilepath) : ''
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
