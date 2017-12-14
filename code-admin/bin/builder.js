const r = require('repl')
let fs = require('fs')
let colors = require('colors')
repls = r.start({prompt: '> ', eval: myEval})
let basemysql = require('../lib/base/mysql')
let koa = require('../koa/index')
// router
require('../koa/router/theme')

function myEval () {}

repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: function () {
    basemysql.endconn()
    koa.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
