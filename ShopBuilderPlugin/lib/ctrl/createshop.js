/** nero
 * create shop
 * 2018-5-23
 */
const fs = require('fs')
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

class createshop {
  init (user) {
    return new Promise((resolve) => {
      if (user) {
        let from = './shop/default/'
        let to = './shop/' + user + '/'
        this.copysource(from, to)
        console.log('success')
        resolve('success')
      } else {
        console.log('failed! user is empty'.red)
        resolve('user is empty')
      }
    })
  }

  copysource (from, to) {
    let myfilepath = from
    let that = this
    if (fs.existsSync(myfilepath)) {
      fs.readdir(myfilepath, function (err, paths) {
        if (err) {
          throw err
        }
        if (paths.length) {
          paths.forEach(function (path, index) {
            let _myfilepath = myfilepath + path
            let _outpath = to + path

            fs.stat(_myfilepath, function (err, file) {
              if (err) {
                console.log('copy error : ' + err)
                throw err
              }
              if (file.isFile()) {
                writefile.copy(_myfilepath, _outpath)
              } else if (file.isDirectory()) {
                that.copysource(_myfilepath + '/', _outpath + '/')
              }
            })
          })
        }
      })
    }
  }
}

module.exports = createshop
