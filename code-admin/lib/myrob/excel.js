/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
let XLSX = require('xlsx')
let workbook
let config = require('../../config/robconf')

// constructor
class excel {
  constructor () {
    // Default options
    this.options = {}
  }

  boot () {
    let myfs = config.fs
    let datalist
    if (fs.existsSync(myfs)) {
      workbook = XLSX.readFile(myfs)
      datalist = this.getexcel()
    } else {
      console.log('excel file is not exist!please make sure your file!!'.red)
    }
    return datalist
  }

  getexcel () {
    let sheetNameList = workbook.SheetNames
    let datalist = []
    let rowkey = config.rowkey
    let mynumlist = []
    sheetNameList.forEach(function (y) { /* iterate through sheets */
      let worksheet = workbook.Sheets[y]
      for (let z in worksheet) {
        /* all keys that do not begin with "!" correspond to cell addresses */
        if (z[0] === '!') continue
        let Letter = z.replace(/[0-9]/g, '')
        let isrow = rowkey.indexOf(Letter)
        if (isrow !== -1) {
          let num = z.replace(/[A-Z]/g, '')
          if (num > 1) {
            let numindex = mynumlist.indexOf(num)
            if (numindex === -1) {
              mynumlist.push(num)
              datalist.push({A: worksheet[z].v})
            } else {
              datalist[numindex][Letter] = worksheet[z].v
            }
          }
        }
      }
    })

    return datalist
  }
}

module.exports = excel
