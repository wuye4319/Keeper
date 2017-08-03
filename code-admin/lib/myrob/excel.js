/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
var fs = require('fs')
var XLSX = require('xlsx')
var workbook
var config = require('../../config/robconf')

// constructor
class excel {
  constructor () {
    // Default options
    this.options = {}
  }

  boot () {
    var myfs = config.fs, datalist
    if (fs.existsSync(myfs)) {
      workbook = XLSX.readFile(myfs)
      datalist = this.getexcel()
    } else {
      console.log('excel file is not exist!please make sure your file!!'.red)
    }
    return datalist
  }

  getexcel () {
    var sheet_name_list = workbook.SheetNames
    var self = this, datalist = []
    var rowkey = config.rowkey
    var mynumlist = []
    sheet_name_list.forEach(function (y) { /* iterate through sheets */
      var worksheet = workbook.Sheets[y]
      for (var z in worksheet) {
        /* all keys that do not begin with "!" correspond to cell addresses */
        if (z[0] === '!') continue
        var Letter = z.replace(/[0-9]/g, '')
        var isrow = rowkey.indexOf(Letter)
        if (isrow != -1) {
          var num = z.replace(/[A-Z]/g, '')
          if (num > 1) {
            var numindex = mynumlist.indexOf(num)
            if (numindex == -1) {
              mynumlist.push(num)
              datalist.push({A: worksheet[z].v})
            } else {
              eval('datalist[numindex].' + Letter + '=worksheet[z].v')
            }
          }
        }
      }
    })

    return datalist
  }
}

module.exports = excel
