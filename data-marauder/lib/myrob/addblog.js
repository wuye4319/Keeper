/**
 * author:nero
 * version:v1.0
 * robot will help me to control all things
 */
'use strict'
const Product = require('builder-plugin/admin/service/product')
let product = new Product()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()

// constructor
class Robot {
  constructor () {
    this.options = {
      title: 'init.txt',
      main_img: '',
      label: '御姐'
    }
  }

  async robot () {
    console.log('robot is running!'.green)
    let datalist = await this.excel()
    await delay.delay(1, true)
    this.proxycontrol(datalist)
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
        name: datalist.B,
        main_img: datalist.C,
        sell_price: datalist.F,
        href: datalist.L,
        pro_kind: datalist.W,
        topic_id: datalist.X
      }
      // add product and get infor after insert.
      let proid = await product.addPro(data)
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
