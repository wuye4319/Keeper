/**
 * Created by nero on 2017/6/2.
 */
const Process = require('../process')
let process = new Process()

const Simg = require('../../work/simg')
let simg = new Simg()
const Snav = require('../../work/snav')
let snav = new Snav()
const Taobao = require('../../work/taobao')
let taobao = new Taobao()

class ctrl {
  async getmall (ctx, rout) {
    let myurl = ctx.url.substr(rout.length + 2)
    let data = await process.filter(myurl, rout, 'pipe')

    let result = taobao.getcont(data)
    result ? ctx.response.body = result : ctx.response.body = 'Get data failed!'
  }

  async getimage (ctx, rout) {
    // get data by url
    // let result = await process.filter(ctx, rout, 'url')
    let result = await process.filter(ctx, rout, 'pipe')
    let result1 = await simg.getcont(result.cont, result.url, rout)
    result ? ctx.response.body = result : ctx.response.body = 'Get data failed!'
  }

  async getimg (url, rout) {
    // get data by url
    let result = await process.filter(url, rout, 'pipe')
    if (result.cont && result.cont !== null) {
      snav.getcont(result.cont, result.url, rout)
    } else {
      console.log('cont is empty!'.red)
    }
  }
}

module.exports = ctrl