/**
 * Created by nero on 2017/3/22.
 *
 */
// release
var fsrelease = require('../rules/release')
rulrelease = new fsrelease()
confrelease = rulrelease.release().release

var writefile = require('../base/writefile')
writefile = new writefile()

function initrel () {
}

// release
initrel.prototype.release = function (param) {
  var bdimg = false
  if (param == 'img') {
    bdimg = true
  }
  for (var i in confrelease) {
    var inhtml = confrelease[i].html
    var outhtml = confrelease[i].outhtml
    var injs = confrelease[i].js
    var outjs = confrelease[i].outjs
    var inimg = confrelease[i].img
    var outimg = confrelease[i].outimg
    this.readwrite(inhtml, outhtml)
    this.readwrite(injs, outjs)
    bdimg ? this.readwrite(inimg, outimg) : ''
  }
}

initrel.prototype.readwrite = function (myfilepath, outfile) {
  var that = this
  fs.readdir(myfilepath, function (err, paths) {
    if (err) {
      throw err
    }
    paths.forEach(function (path) {
      var _myfilepath = myfilepath + path
      var _outfile = outfile + path
      var readable, writable

      fs.stat(_myfilepath, function (err, file) {
        if (err) {
          throw err
        }
        if (file.isFile()) {
          var str = fs.readFileSync(_myfilepath).toString()
          var newfile = writefile.writejs(_outfile, str)
          // pipe data
          readable = fs.createReadStream(_myfilepath)
          writable = fs.createWriteStream(_outfile)
          readable.pipe(writable)
          readable.on('end', function () {
            console.log(_outfile.yellow + ' is ready to release!'.green)
          })
          readable.on('error', function (err) {
            console.log('error occur in read file'.red)
          })
        } else if (file.isDirectory()) {
          that.readwrite(_myfilepath + '/', _outfile + '/')
        }
      })
    })
  })
}

module.exports = initrel
