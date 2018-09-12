/**
 * Created by nero on 2017/6/2.
 */
const Proxy = require('keeper-proxy')
let proxy = new Proxy()
const Action = require('./action')
let action = new Action()
require('./global')

// subject
proxy.addrouter(/^\/image(?:\/|$)/, async (ctx) => {
  await action.getimage(ctx, 'image')
})
// subject
proxy.addrouter(/^\/taobao(?:\/|$)/, async (ctx) => {
  await action.getmall(ctx, 'taobao')
})
