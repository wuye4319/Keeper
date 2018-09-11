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

  async getimg (url, rout) {
    // get data by url
    // http://top.baidu.com/?fr=tph_right
    // http://top.baidu.com/buzz?b=341&c=513&fr=topbuzz_b42_c513
    let url = 'http://www.live163.info/forum-155-1.html'
    let result = await process.filter(url, rout, 'pipe')
    if (result.cont && result.cont !== null) {
      simg.getcont(result.cont, result.url, rout)
    } else {
      console.log('cont is empty!'.red)
    }
  }
}

module.exports = ctrl
