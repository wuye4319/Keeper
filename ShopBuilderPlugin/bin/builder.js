const Rout = require('../koa/router/rout')
let rout = new Rout()
const Fscompile = require('../lib/compile')
let compile = new Fscompile()

const fsconf = require('../lib/ctrl/readconf')
let conf = new fsconf()

repls.defineCommand('conf', {
  help: 'setting config of config.js'.green,
  action: function (param) {
    conf.conf(param)
    this.displayPrompt()
  }
})
repls.defineCommand('pub', {
  help: 'public code by path'.green,
  action: function (param) {
    if (param) {
      compile.pub(param)
      this.displayPrompt()
    } else {
      console.log('Tell me the path'.red)
    }
  }
})
repls.defineCommand('wrap', {
  help: 'warpper'.green,
  action: function (param) {
    compile.wrap(param)
    this.displayPrompt()
  }
})
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: function () {
    rout.closeall()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
