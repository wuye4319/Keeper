/**
 * Created by nero on 2017/6/2.
 */
const Process = require('./process')
let process = new Process()

const Simg = require('../../work/seximg')
let simg = new Simg()

class ctrl {
  async getmall (ctx, rout) {
    let result = await process.filter(ctx, rout, 'pipe')

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
    simg.getcont(result)
  }
}

module.exports = ctrl
