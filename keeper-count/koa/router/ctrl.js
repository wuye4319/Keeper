/**
 * Created by nero on 2017/6/2.
 */
const path = require('path')
const os = require('os')

class ctrl {
  async count (ctx, rout) {
    console.log(ctx.url, rout)
    console.log(os.cpus())
  }
}

module.exports = ctrl
