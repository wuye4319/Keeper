/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'

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

  mymkdirs (file) {
    var index = file.lastIndexOf('/')
    if (index === -1) index = file.lastIndexOf('\\')
    let dir = file.substr(0, index + 1)

    if (dir.indexOf('\\') != -1) {
      dir = path.normalize(dir)
      dir = dir.replace(/\\/g, '/')
    }

    // creat dir first
    this.createdirs(dir)
  }

  writejs (file, content) {
    this.mymkdirs(file)
    // write file
    fs.writeFileSync(file, content)
    this.options.newfile = true
    // return
    return this.options.newfile
  }

  append (file, content) {
    this.mymkdirs(file)
    fs.appendFileSync(file, content)
  }

  copy (from, tourl) {
    var result
    var str = fs.readFileSync(from).toString()
    this.writejs(tourl, str)
    var isright = fs.existsSync(tourl)
    isright ? result = true : result = false
    return result
  }

  createdirs (dir) {
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
