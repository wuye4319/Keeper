const r = require('repl')
repls = r.start({prompt: '> ', eval: myEval})
var koa = require('../koa/index')

const Fscache = require('keeper-core/cache/cache')
let cache = new Fscache()

function myEval () {}

// router
require('../koa/router/seo')

repls.defineCommand('clear', {
  help: 'clear cache file'.red,
  action: function () {
    // temp
    cache.delcache()
  }
})
repls.defineCommand('clone', {
  help: 'clone'.green,
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
