/**
 * author:nero
 * version:v1.0
 * robot will help me to control all things
 */
// async
let async = require('async')
let datalist = [], listindex = 0
let fsstatic = require('../ctrl/static')
let mystatic = new fsstatic()

// constructor
class Robot {
  constructor () {
    // Default options
    this.options = {}
  }

  // launcher
  robot (sitepage, Prompt) {
    console.log('robot is running!'.green)
    var self = this
    async.waterfall([
      this.proxy,
      this.delay
    ], function (err, result) {
      if (result) {
        console.log('finished!')
      }
    })
  }

  proxy (callback) {
    var file = __dirname + '/../rules.js'
    var configstr = fs.readFileSync(file).toString()
    var temprules = eval(configstr)
    var rules = new temprules('rob')
    rules.infor()

    console.log('proxy'.blue + listindex)
    mystatic.static()
    callback(null, 3, '')
    listindex++
  }

  delay (second, data, callback) {
    // pass last delay
    var islast = (listindex == datalist.length)
    var count = islast ? 0 : second
    async.during(
      function (callback) {
        return callback(null, count >= 0)
      },
      function (callback) {
        islast || console.log(count)
        count--
        setTimeout(callback, 1000)
      },
      function (err) {
        console.log('rest is over!'.green)
        callback(null, 'true', data)
      }
    )
  }
}

module.exports = Robot
