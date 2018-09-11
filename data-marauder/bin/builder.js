let path = require('path')
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()
const koa = require('../koa/index')
require('../koa/router/rout')

// proxy taobao
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
proxy.init()
proxy.initproxybrowser()

const Ctrl = require('../koa/router/ctrl')
let ctrl = new Ctrl()
repls.defineCommand('sex', {
  help: 'Clear all cache, confirm your opration carefully!'.green,
  action: function () {
    // temp
    ctrl.getimg('image')
  }
})
repls.defineCommand('clear', {
  help: 'Clear all cache, confirm your opration carefully!'.green,
  action: function () {
    // temp
    let mycache = path.join(__dirname, '../../../cache/')
    del.deleteSource(mycache, 'all')
  }
})
repls.defineCommand('ipinterval', {
  help: 'Set interval of change ip'.green,
  action: function (time) {
    // temp
    if (time) {
      proxy.setipinterval(time)
    } else {
      console.log('please enter time!'.red)
    }
  }
})
repls.defineCommand('auto-login', {
  help: 'auto login for taobao'.green,
  action: function (account) {
    // temp
    let tempPro = 'https://detail.tmall.com/item.htm?id=554802892200'
    // let tempPro = 'https://www.tmall.com/'
    let url = 'https://login.tmall.com/?from=sm&redirectURL='
    proxy.login(url, tempPro, account || 0)
  }
})
repls.defineCommand('manualchangeip', {
  help: 'Close active change ip, and manual change ip by index'.red,
  action: async function () {
    await proxy.manualchangeip()
  }
})
repls.defineCommand('autoproxy', {
  help: 'Auto active change ip'.red,
  action: async function () {
    await proxy.autoproxy()
  }
})
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: async function () {
    await proxy.close()
    // koa,do not merge to proxy!
    koa.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
