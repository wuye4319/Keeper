/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'

const fs = require('fs')
const path = require('path')
const Arrdir = require('./arrdir')
let arrdir = new Arrdir()

class Writefile {
  constructor () {
    // Default options
    this.options = {
      newfile: false
    }
  }

  mymkdirs (file) {
    let index = file.lastIndexOf('/')
    if (index === -1) index = file.lastIndexOf('\\')
    let dir = file.substr(0, index + 1)

    if (dir.indexOf('\\') !== -1) {
      dir = path.normalize(dir)
      dir = dir.replace(/\\/g, '/')
    }

    // creat dir first
    this.createdirs(dir)
  }

  writejs (file, content) {
    this.mymkdirs(file)
    // write file
    let res = fs.writeFileSync(file, content)
    // return
    return res || true
  }

  append (file, content) {
    this.mymkdirs(file)
    fs.appendFileSync(file, content)
  }

  copy (from, tourl) {
    let result
    let str = fs.readFileSync(from).toString()
    this.writejs(tourl, str)
    let isright = fs.existsSync(tourl)
    isright ? result = true : result = false
    return result
  }

  createdirs (dir) {
    let mydir = arrdir.arrdir(dir).reverse()
    // create dir
    for (let i in mydir) {
      let dir = mydir[i]
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, function (err) {
          if (err) console.log(err)
        })
      }
    }
  }
}

module.exports = Writefile
