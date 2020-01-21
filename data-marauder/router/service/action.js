/**
 * Created by nero on 2017/6/2.
 */
const Process = require('../process')
let process = new Process()

const Simg = require('../../mission/simg')
let simg = new Simg()
const Taobao = require('../../mission/taobao')
let taobao = new Taobao()

class ctrl {
  async getmall (ctx, rout) {
    let myurl = ctx.url.substr(rout.length + 2)
    let data = await process.filter(myurl, rout, 'pipe')

    let result = taobao.getcont(data)
    result ? ctx.response.body = result : ctx.response.body = 'Get data failed!'
  }

  async getimg (url, rout) {
    // get data by url
    let result = await process.filter(url, rout, 'pipe')
    if (result.cont && result.cont !== null) {
      simg.getcont(result.cont, result.url, rout)
    } else {
      console.log('cont is empty!'.red)
    }
  }
}

module.exports = ctrl
