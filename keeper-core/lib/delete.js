/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const path = require('path')

// constructor
class Delete {
  // delete source from path
  deleteSource(mypath, type) {
    if (type === 'all') {
      this.deleteAll(mypath)
    } else if (fs.existsSync(mypath)) {
      this.deletefile(mypath)
    }
  }

  deletefile(dir) {
    fs.unlinkSync(dir)
    console.log('Successful deletion of '.green + dir.yellow)
  }

  deleteDir(dir) {
    if (fs.existsSync(dir)) {
      // if dir is empty,delete dir.
      if (!fs.readdirSync(dir).length) {
        fs.rmdirSync(dir)
        console.log(dir.yellow + ' folder deleted successfully!'.cyan)
      }
    } else {
      console.error('Error, '.red + dir + ' does not exist!'.red)
    }
  }

  // foreach the path to delete file, delete all files by path
  deleteAll(filepath) {
    if (fs.existsSync(filepath)) {
      let paths = fs.readdirSync(filepath)
      let that = this
      if (paths.length) {
        paths.forEach(function (tempath, index) {
          let _myfilepath = path.join(filepath, tempath)

          let file = fs.statSync(_myfilepath)
          if (file.isFile()) {
            that.deletefile(_myfilepath)
          } else if (file.isDirectory()) {
            that.deleteAll(_myfilepath + '/')
          }

          if (index === paths.length - 1) {
            // last file
            that.deleteDir(filepath)
          }
        })
      } else {
        // delete empty dir
        that.deleteDir(filepath)
      }
    }
  }
}

module.exports = Delete
