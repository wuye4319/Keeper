const r = require('repl')
var fs = require('fs')
var colors = require('../colors')
repls = r.start({prompt: '> ', eval: myEval})
var basemysql = require('../lib/base/mysql')
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
    basemysql.endconn()
    koa.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
