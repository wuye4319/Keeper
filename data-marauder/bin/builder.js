let path = require('path')
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()
const KoaProxy = require('keeper-proxy')
let koaproxy = new KoaProxy()
require('../router/service/rout')

// proxy taobao
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
const Ctrl = require('../router/operation/ctrl')
let ctrl = new Ctrl()
proxy.init()
proxy.initproxybrowser()

const Action = require('../router/service/action')
let action = new Action()
const Robot = require('../lib/myrob/robot')
let robot = new Robot()

repls.defineCommand('rob', {
  help: 'a robot to do sth for you'.green,
  action: function (param) {
    robot.robot()
    this.displayPrompt()
  }
})
repls.defineCommand('simgnav', {
  help: 'Get image!'.green,
  action: function () {
    // http://top.baidu.com/?fr=tph_right
    // http://top.baidu.com/buzz?b=341&c=513&fr=topbuzz_b42_c513
    let url = 'http://www.live163.info/forum-155-1.html'
    action.getimg(url, 'simagenav')
  }
})
const Base64 = require('../lib/writebase64')
let base64 = new Base64()
repls.defineCommand('base64', {
  help: 'write base64 to file'.green,
  action: function () {
    base64.tofile()
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
repls.defineCommand('clearprocess', {
  help: 'Clear all cache, conform your opration carefully!'.green,
  action: function () {
    // temp
    ctrl.clearinternumb()
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
    koaproxy.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
