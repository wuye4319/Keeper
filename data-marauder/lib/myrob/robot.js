/**
 * author:nero
 * version:v1.0
 * robot will help me to control all things
 */
'use strict'
const Product = require('builder-plugin/admin/service/product')
let product = new Product()
const Basemysql = require('builder-plugin/admin/base/mysql')
let basemysql = new Basemysql()

const Excel = require('./excel')
let excel = new Excel()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()

let crypto = require('crypto')

// temp hash
let md5 = crypto.createHash('md5')
// please change this param
let topicID = 9
let codeid = md5.update(topicID.toString()).digest('hex')
codeid = codeid.substr(22)
console.log(topicID + ' ==> ' + codeid)

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
    await delay.delay(1, true)
    this.proxycontrol(datalist)
  }

  excel () { // transfrom excel data to json
    return new Promise((resolve) => {
      let datalist = excel.boot()
      // console.log(datalist)
      console.log('excel data is read complete! proxy will working at 2 seconds later!'.green)
      resolve(datalist)
    })
  }

  // init the plugin 'phantom'
  async mysql (datalist, index, proid) {
    proid = proid + parseInt(index)
    return new Promise(async (resolve) => {
      let md5 = crypto.createHash('md5')
      let codeid = md5.update(proid.toString()).digest('hex')
      codeid = codeid.substr(22)
      /** A proid
       *  B proname
       *  C mainimg
       *  F price
       *  L prohref
       */
      let data = {
        pro_id: datalist.A,
        name: datalist.B,
        code: codeid,
        main_img: datalist.C,
        sell_price: datalist.F,
        href: datalist.L,
        // pro_kind: datalist.W, // mysort
        topic_id: topicID
      }
      // add product and get infor after insert.
      let haspro = await product.hasPro(data.pro_id)
      if (haspro) {
        console.log('product is repeat'.red)
      } else {
        await product.addPro(data)
      }
      resolve()
    })
  }

  async proxycontrol (datalist) { // control of proxy and mysql
    let proid = await product.getProID()
    let count
    for (let i in datalist) {
      await this.mysql(datalist[i], i, proid.id)
      count = parseInt(i) + 1
    }
    console.log(count)

    console.log('all mission is finished!'.red)
    basemysql.endconn()
  }
}

module.exports = Robot
