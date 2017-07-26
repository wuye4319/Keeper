/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict'
// var vm = require('vm');
var fs = require('fs')
const path = require('path')
var fsarrdir = require('./arrdir')
var arrdir = new fsarrdir()

class Writefile {
  constructor () {
        // Default options
    this.options = {
      newfile: false
    }
  }

  writejs (file, content) {
    var index = file.lastIndexOf('/')
    var dir = file.substr(0, index + 1)
    if (dir.indexOf('\\') != -1) {
      dir = path.normalize(dir)
      dir = dir.replace(/\\/g, '/')
    }
        // creat dir first
    this.mymkdirs(dir)
        // write file
    fs.writeFileSync(file, content)
    this.options.newfile = true
        // return
    return this.options.newfile
  }

  copy (from, tourl) {
    var result
    var str = fs.readFileSync(from).toString()
    var newfile = this.writejs(tourl, str)
    var isright = fs.existsSync(tourl)
    isright ? result = true : result = false
    return result
  }

  mymkdirs (dir) {
    var mydir = arrdir.arrdir(dir).reverse()
        // create dir
    for (var i in mydir) {
      var dir = mydir[i]
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, function (err) {
          if (err) console.log(err)
        })
      }
    }
  }
}

module.exports = Writefile
