let path = require('path')
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()
const Rout = require('../koa/router/rout')
let rout = new Rout()

// proxy taobao
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
const Ctrl = require('../koa/router/ctrl')
let ctrl = new Ctrl()
proxy.init()
proxy.initproxybrowser()

repls.defineCommand('clear', {
  help: 'Clear all cache, conform your opration carefully!',
  action: function () {
    // temp
    let mycache = path.join(__dirname, '../../../cache/')
    del.deleteSource(mycache, 'all')
  }
})
repls.defineCommand('clearprocess', {
  help: 'Clear all cache, conform your opration carefully!',
  action: function () {
    // temp
    ctrl.clearinternumb()
  }
})
repls.defineCommand('ipinterval', {
  help: 'Set interval of change ip',
  action: function (time) {
    // temp
    if (time) {
      proxy.setipinterval(time)
    } else {
      console.log('please enter time!')
    }
  }
})
repls.defineCommand('auto-login', {
  help: 'auto login for taobao',
  action: function (account) {
    // temp
    let tempPro = 'https://www.tmall.com/'
    // let tempPro = 'https://www.tmall.com/'
    let url = 'https://login.taobao.com/member/login.jhtml?tpl_redirect_url='
    // proxy.login(url, tempPro, account || 0)
    proxy.logintest(url, tempPro)
  }
})
repls.defineCommand('manualchangeip', {
  help: 'Close active change ip, and manual change ip by index',
  action: async function () {
    await proxy.manualchangeip()
  }
})
repls.defineCommand('autoproxy', {
  help: 'Auto active change ip',
  action: async function () {
    await proxy.autoproxy()
  }
})
repls.defineCommand('/', {
  help: 'end and exit',
  action: async function () {
    await proxy.close()
    // koa,do not merge to proxy!
    rout.close()
    console.log('Thanks for using! Bye~~~')
    this.close()
  }
})
