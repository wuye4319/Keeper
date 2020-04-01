/**
 * Created by nero on 2017/6/2.
 */
const Proxy = require('keeper-proxy')
let proxy = new Proxy()
const Action = require('./action')
let action = new Action()
require('../operation/global')

// get taobao product list
// http://localhost:8080/taopro/
proxy.addrouter(/^\/taopro(?:\/|$)/, async (ctx) => {
  // let url = 'https://www.nvsheen.space/forum-155-1.html'
  let url = 'https://pub.alimama.com/promo/search/index.htm'

  await action.getimg(url, ctx, 'taopro')
})
// get taobao code by id
// http://localhost:8080/taocode/
proxy.addrouter(/^\/taocode(?:\/|$)/, async (ctx) => {
  await action.getTaocode(ctx, 'taocode')
})
// analysis taobao product list
// http://localhost:8080/analysis/
proxy.addrouter(/^\/analysis(?:\/|$)/, async (ctx) => {
  await action.analysisinfor(ctx, 'analysis')
})