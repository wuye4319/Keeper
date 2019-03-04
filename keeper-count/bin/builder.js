const r = require('repl')
repls = r.start({prompt: '> ', eval: myEval})

let path = require('path')
const koa = require('../koa/index')
require('../koa/router/rout')

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

repls.defineCommand('clear', {
  help: 'clear'.green,
  action: function () {
    // temp
  }
})
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: async function () {
    // koa,do not merge to proxy!
    koa.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
