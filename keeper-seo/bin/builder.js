const r = require('repl')
repls = r.start({prompt: '> ', eval: myEval})
var koa = require('../koa/index')

function myEval () {}

// router
require('../koa/router/seo')

repls.defineCommand('clone', {
  help: 'end and exit'.red,
  action: function () {
    // temp
  }
})
repls.defineCommand('.', {
  help: 'end and exit'.red,
  action: function () {
    koa.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
