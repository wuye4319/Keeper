#!/usr/bin/env node
var colors = require('colors')
let fs = require('fs')
let path = require('path')
var ready = require('./ready')
ready = new ready()

const name = 'code-keeper'
console.log(path.resolve())

// check program running environment.
var iskeeper = fs.existsSync('./node_modules/' + name + '/bin/main.js')
if (iskeeper) {
  var isready = fs.existsSync('./node_modules/' + name + '/config/sysconf.js')
  if (!isready) {
    ready.boot()
  } else {
    bootstrap()
  }
} else {
  console.log('Keeper is running at wrong Environment!!!'.red)
}

function bootstrap () {
  require('./builder')
  require('./bdrelease')
  require('./bdinit')
  require('./bdrob')
}
