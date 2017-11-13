const r = require('repl')
repls = r.start({prompt: '> ', eval: myEval})
const koa = require('../koa/index')

let path = require('path')
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()

const Fscache = require('keeper-core/cache/cache')
let cache = new Fscache()

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

repls.defineCommand('clone', {
  help: 'clone'.green,
  action: function () {
    // temp
  }
})
repls.defineCommand('clear', {
  help: 'clone'.green,
  action: function () {
    // temp
    let mycache = path.join(__dirname, '../../../cache/')
    del.deleteSource(mycache, 'all')
  }
})

// proxy taobao
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
proxy.init()
repls.defineCommand('login', {
  help: 'clone'.green,
  action: function () {
    // temp
    let tempPro = 'https://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.231.53c9d5be860lfh&id=554802892200&areaId=440300&user_id=2214167570&cat_id=2&is_b=1&rn=68394abcbd856bd2886912f499c75ece'
    let url = 'https://login.tmall.com/?from=sm&redirectURL=' + tempPro
    proxy.login(url)
  }
})
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: async function () {
    koa.close()
    await proxy.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
