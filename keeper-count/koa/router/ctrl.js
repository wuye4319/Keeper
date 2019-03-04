/**
 * Created by nero on 2017/6/2.
 */
const path = require('path')

class ctrl {
  async count (ctx, rout) {
    console.log(ctx.url, rout)
  }
}

module.exports = ctrl
