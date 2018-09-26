/** nero
 * create shop
 * 2018-5-23
 */
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Fsrules = require('./loadconf')
let rules = new Fsrules()

class createshop {
  init (user) {
    this.inituserdata(user)
    // this.copyshop()
  }

  inituserdata (user) {
    let config = rules.createshop('', user)
    writefile.copy(config.fromconfig, config.toconfig)
  }

  copyshop () {
    let from = './theme/static/source/'
    let to = './shop/testuser/theme/static/source/'
    this.copysource(from, to)
  }

  copysource (from, to) {
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

module.exports = createshop
