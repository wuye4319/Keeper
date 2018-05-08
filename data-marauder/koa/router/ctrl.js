/**
 * Created by nero on 2017/6/2.
 */
const Process = require('./process')
let process = new Process()

const Simg = require('../../work/simg')
let simg = new Simg()
const Taobao = require('../../work/taobao')
let taobao = new Taobao()

class ctrl {
  async getmall (ctx, rout) {
    let data = await process.filter(ctx, rout, 'pipe')

    let result = taobao.getcont(data)
    if (result) {
      ctx.response.body = result
    } else {
      ctx.response.body = 'Get data failed!'
    }
  }

  async getimage (ctx, rout) {
    // get data by url
    // let result = await process.filter(ctx, rout, 'url')
    let result = await process.filter(ctx, rout, 'pipe')
    simg.getcont(result.cont, result.url, rout)
  }
}

module.exports = ctrl
