const r = require('repl')
repls = r.start({prompt: '> ', eval: myEval})
const koa = require('../koa/index')

let path = require('path')
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()

// proxy taobao
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
proxy.init()

global.myvari = {anslist: [], answer: {}}

// listener
function myEval (cmd, context, filename, callback) {
  let anslist = global.myvari.anslist
  let indx = -1
  let mycmd
  for (let i in anslist) {
    mycmd = cmd.trim().split(' ')
    if (typeof (anslist[i]) === 'string') {
      if (anslist[i] === mycmd[0]) indx = i
    } else {
      if (Object.keys(anslist[i])[0] === mycmd[0]) indx = i
    }
  }
  if (indx === -1) {
    console.log('Invalid keyword!!!'.red)
  } else {
    global.myvari.anslist = []
    let args = mycmd.length > 1 ? mycmd[1] : ''
    typeof (anslist[indx]) === 'string' ? eval('myvari.answer.' + anslist[indx] + '(' + args + ')') : eval('myvari.answer.' + Object.values(anslist[indx]) + '(' + args + ')')
  }
  this.displayPrompt()
}

// router
require('../koa/router/ctrl')

repls.defineCommand('clear', {
  help: 'clear'.green,
  action: function () {
    // temp
    let mycache = path.join(__dirname, '../../../cache/')
    del.deleteSource(mycache, 'all')
  }
})

repls.defineCommand('auto-login', {
  help: 'auto login for taobao'.green,
  action: function (account) {
    // temp
    let tempPro = 'https://detail.tmall.com/item.htm?id=554802892200'
    let url = 'https://login.tmall.com/?from=sm&redirectURL='
    proxy.login(url, tempPro, account)
  }
})
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: async function () {
    koa.close()
    proxy.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
const Getcode = require('../lib/getcode')
let getcode = new Getcode()
repls.defineCommand('verify', {
  help: 'end and exit'.red,
  action: async function () {
    getcode.getcode()
  }
})
