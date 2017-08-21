#!/usr/bin/env node
var colors = require('colors')
fs = require('fs')
var ready = require('./ready')
ready = new ready()

// check program running environment.
var iskeeper = fs.existsSync('./node_modules/keeper-seo/bin/main.js')
if (iskeeper) {
  var isready = fs.existsSync('./node_modules/keeper-seo/config/sysconf.js')
  if (!isready) {
    ready.boot()
  } else {
    bootstrap()
  }
} else {
  console.log('Seo is running at wrong Environment!!!'.red)
}

function bootstrap () {
  require('./builder')
}
