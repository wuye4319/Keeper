/**
 * Created by nero on 2017/6/2.
 */
const Process = require('./process')
let process = new Process()

const Seximg = require('../../work/seximg')
let seximg = new Seximg()

class ctrl {
  async getmall (ctx, rout) {
    let result = await process.filter(ctx, rout)

    if (result) {
      ctx.response.body = result
    } else {
      ctx.response.body = 'Get data failed!'
    }
  }

  async getseximage (ctx, rout) {
    let result = await process.filter(ctx, rout, 'url')
    seximg.getcont(result)
  }
}

module.exports = ctrl
