const r = require('repl')
repls = r.start({prompt: '> ', eval: myEval})
var fscompile = require('../lib/compile')
var compile = new fscompile()

global.myvari = {anslist: [], answer: {}}

// listener
function myEval (cmd, context, filename, callback) {
  let anslist = myvari.anslist, indx = -1
  for (let i in anslist) {
    if (typeof (anslist[i]) === 'string') {
      if (anslist[i] == cmd.trim()) indx = i
    } else {
      if (Object.keys(anslist[i])[0] === cmd.trim()) indx = i
    }
  }
  if (indx === -1) {
    console.log('Invalid keyword!!!'.red)
  } else {
    myvari.anslist = []
    typeof (anslist[indx]) === 'string' ? eval('myvari.answer.' + anslist[indx] + '()') : eval('myvari.answer.' + Object.values(anslist[indx]) + '()')
  }
  this.displayPrompt()
}

repls.defineCommand('reload', {
  help: 'reload all setting of config.js'.green,
  action: function (param) {
    compile.reload()
    this.displayPrompt()
  }
})

repls.defineCommand('dev', {
  help: 'compile your program with develop'.green,
  action: function (param) {
    compile.dev(param)
    this.displayPrompt()
  }
})
repls.defineCommand('e', {
  help: 'out dev model'.green,
  action: function () {
    compile.outdev()
    this.displayPrompt()
  }
})
repls.defineCommand('pub', {
  help: 'compile your program with public'.green,
  action: function (param) {
    compile.pub(param)
    this.displayPrompt()
  }
})
repls.defineCommand('wrap', {
  help: 'compile your program with public'.green,
  action: function (param) {
    compile.wrap(param)
    this.displayPrompt()
  }
})
repls.defineCommand('.', {
  help: 'end and exit'.red,
  action: function () {
    compile.outdev()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
