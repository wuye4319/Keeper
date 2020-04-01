/**
 * Created by nero on 2017/6/2.
 */
const Process = require('../process')
let process = new Process()

const Simg = require('../../mission/simg')
let simg = new Simg()
const Taobao = require('../../mission/taobao')
let taobao = new Taobao()

const Center = require('../../mission/mining/center')
let center = new Center()

// use this !!!
// const Ctrl = require('./ctrl')
// let ctrl = new Ctrl()

class action {
  async getmall(ctx, rout) {
    let myurl = ctx.url.substr(rout.length + 2)
    let data = await process.filter(myurl, rout, 'pipe')

    let result = taobao.getcont(data)
    result ? ctx.response.body = result : ctx.response.body = 'Get data failed!'
  }

  async getimg(url, ctx, rout) {
    let rules = ['optimus.material.json']
    // get data by url
    let result = await process.filter(url, rout, 'pipe', rules)
    simg.getcont(result.apidata, result.url, rout)

    ctx.response.body = result && result.cont !== null ? result : 'Get data failed!'
  }

  async getTaocode(ctx, rout) {
    await process.getTaocode('self')
  }

  async analysisinfor(ctx, rout) {
    await center.analyprolist('taopro')
  }
}

module.exports = action
