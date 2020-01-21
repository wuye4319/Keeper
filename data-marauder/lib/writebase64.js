/**
 * author:nero
 * version:v1.0
 * write base64 into files
 */
'use strict'
const fs = require('fs')

class base64 {
  tofile () {
    let img64 = './static/opencv/64.txt'
    let imgdata = fs.readFileSync(img64).toString()
    let base64Data = imgdata.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = new Buffer(base64Data, 'base64')
    let imgname = Math.ceil(Math.random() * 1000000000)
    fs.writeFile(imgname + '.png', dataBuffer, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('保存成功！')
      }
    })
  }
}

module.exports = base64
