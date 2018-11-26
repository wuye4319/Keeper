/**
 * author:nero
 * version:v1.0
 * robot will help me to control all things
 */
'use strict'
const mysql = require('../../../../admin/service/product')
const Excel = require('./excel')
let excel = new Excel()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()
console.log('rob : { w : kindid, x : themeid, y : mysort || null }')

// constructor
class Robot {
  constructor () {
    this.options = {
      stream: process.stdout
    }
  }

  async robot () {
    console.log('robot is running!'.green)
    let datalist = await this.excel()
    await delay.delay(3, true)
    this.proxycontrol(datalist)
  }

  excel () { // transfrom excel data to json
    return new Promise((resolve) => {
      let datalist = excel.boot()
      console.log('excel data is read complete! proxy will working at 5 seconds later!'.green)
      resolve(datalist)
    })
  }

  // init the plugin 'phantom'
  async mysql (datalist) {
    return new Promise(async (resolve) => {
      /** A proid
       *  B proname
       *  C mainimg
       *  F price
       *  L prohref
       */
      let data = {
        ProName: datalist.B,
        MainImg: datalist.C,
        Price: datalist.F,
        ProHref: datalist.L,
        ProKind: datalist.W,
        ThemeID: datalist.X,
        MySort: datalist.Y || ''
      }
      // add product and get infor after insert.
      let proid = await mysql.addpro(data)
      console.log(await mysql.getpro(proid))
      resolve()
    })
  }

  async proxycontrol (datalist) { // control of proxy and mysql
    for (let i in datalist) {
      await this.mysql(datalist[i])
    }

    console.log('all mission is finished!'.red)
  }
}

module.exports = Robot
