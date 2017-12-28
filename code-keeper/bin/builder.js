const Fscompile = require('../lib/compile')
let compile = new Fscompile()

require('./bdrelease')
require('./bdinit')
require('./bdrob')

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
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: function () {
    compile.outdev()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
