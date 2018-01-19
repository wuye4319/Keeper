let path = require('path')
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()
const koa = require('../koa/index')
require('../koa/router/rout')

// proxy taobao
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
proxy.init()

repls.defineCommand('clear', {
  help: 'clear'.green,
  action: function () {
    // temp
    let mycache = path.join(__dirname, '../../../cache/')
    del.deleteSource(mycache, 'all')
  }
})
repls.defineCommand('ipinterval', {
  help: 'auto login for taobao'.green,
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
    let url = 'https://login.tmall.com/?from=sm&redirectURL='
    if (account) {
      proxy.login(url, tempPro, account)
    } else {
      console.log('Please chose the account first, Begin with 0'.red)
    }
  }
})
repls.defineCommand('proxy', {
  help: 'end and exit'.red,
  action: async function (index) {
    await proxy.changeip(index)
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
const Getcode = require('../lib/gethttp')
let getcode = new Getcode()
repls.defineCommand('verify', {
  help: 'end and exit'.red,
  action: async function () {
    getcode.getcode()
  }
})
