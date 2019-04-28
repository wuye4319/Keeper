/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'

const fs = require('fs')
const path = require('path')

class Writefile {
  constructor() {
    // Default options
    this.options = {
      newfile: false
    }
  }

  arrdir(longdir) {
    let arrdir = [longdir]
    let dirlen = longdir.split(path.sep).length

    while (dirlen > 2) {
      longdir = path.dirname(longdir)
      dirlen = longdir.split(path.sep).length
      arrdir.push(longdir)
    }
    return arrdir
  }

  mymkdirs(file) {
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

  writejs(file, content) {
    this.mymkdirs(file)
    // write file
    fs.writeFileSync(file, content)
    console.log('Successful creation of '.green + file.yellow)
  }

  append(file, content) {
    this.mymkdirs(file)
    fs.appendFileSync(file, content)
  }

  copy(from, tourl) {
    let str = fs.readFileSync(from).toString()
    this.writejs(tourl, str)
    fs.existsSync(tourl)
  }

  readdir(filepath, to) {
    let paths = fs.readdirSync(filepath)
    let that = this
    if (paths.length) {
      paths.forEach(function (tempath) {
        let _myfilepath = path.join(filepath, tempath)

        let file = fs.statSync(_myfilepath)
        if (file.isFile()) {
          let str = fs.readFileSync(_myfilepath).toString()
          let newdir = path.join(to, tempath)
          that.writejs(newdir, str)
        } else if (file.isDirectory()) {
          let newdir = path.join(to, tempath)
          that.createdirs(newdir)
          that.readdir(_myfilepath, newdir)
        }
      })
    }
  }

  copydir(myfilepath, to) {
    if (fs.existsSync(myfilepath)) {
      this.readdir(myfilepath, to)
    } else {
      console.log('Tpl error')
    }
  }

  createdirs(dir) {
    let mydir = this.arrdir(dir).reverse()
    // create dir
    for (let i in mydir) {
      let dir = mydir[i]
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
    }
  }
}

module.exports = Writefile
