/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
const fs = require('fs')

// constructor
class Delete {
  // delete source from path
  deleteSource (mypath, type) {
    if (type === 'all') {
      this.deleteAll(mypath)
    } else if (fs.existsSync(mypath)) {
      this.deletefile(mypath)
    }

    return true
  }

  deletefile (dir) {
    fs.unlinkSync(dir)
    console.log(dir + ' is delete successed!')
  }

  deleteDir (dir) {
    if (fs.existsSync(dir)) {
      // if dir is empty,delete dir.
      if (!fs.readdirSync(dir).length) {
        fs.rmdirSync(dir)
        console.log(dir + ' dir is delete successed!')
      }
    } else {
      console.error('error, ' + dir + ' is not exist!')
    }
  }

  // foreach the path to delete file, delete all files by path
  deleteAll (myfilepath) {
    let that = this
    if (fs.existsSync(myfilepath)) {
      fs.readdir(myfilepath, function (err, paths) {
        if (err) {
          throw err
        }
        if (paths.length) {
          paths.forEach(function (path, index) {
            let _myfilepath = myfilepath + path

            fs.stat(_myfilepath, function (err, file) {
              if (err) {
                throw err
              }
              if (file.isFile()) {
                that.deletefile(_myfilepath)
                if (index === paths.length - 1) {
                  // last file
                  that.deleteDir(myfilepath)
                }
              } else if (file.isDirectory()) {
                that.deleteAll(_myfilepath + '/')
              }
            })
          })
        } else {
          // delete empty dir
          that.deleteDir(myfilepath)
        }
      })
    }
  }
}

module.exports = Delete
