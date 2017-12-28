#!/usr/bin/env node
require('colors')
let fs = require('fs')
let path = require('path')
const Ready = require('./ready')
let ready = new Ready()

const r = require('repl')
global.repls = r.start({prompt: '> ', eval: myEval})

global.myvari = {anslist: [], answer: {}}

// listener 提取到文件
function myEval (cmd, context, filename, callback) {
  let anslist = global.myvari.anslist
  let indx = -1
  for (let i in anslist) {
    if (typeof (anslist[i]) === 'string') {
      if (anslist[i] === cmd.trim()) indx = i
    } else {
      if (Object.keys(anslist[i])[0] === cmd.trim()) indx = i
    }
  }
  if (indx === -1) {
    console.log('Invalid keyword!!!'.red)
  } else {
    global.myvari.anslist = []
    typeof (anslist[indx]) === 'string' ? global.myvari.answer[anslist[indx]]() : global.myvari.answer[Object.values(anslist[indx])]()
  }
  this.displayPrompt()
}

let plugname = 'code-keeper'

// check program running environment.
let sysconf = path.resolve('./node_modules/' + plugname + '/config/sysconf.js')
var isready = fs.existsSync(sysconf)
if (isready) {
  let tempver = fs.readFileSync(path.join(__dirname, '/../../' + plugname + '/package.json')).toString()
  let currversion = JSON.parse(tempver).version
  let preversion = require(sysconf)
  if (preversion.check_env === currversion) {
    bootstrap()
  } else {
    boot()
  }
} else {
  boot()
}

function boot () {
  console.log('This is a new Object (first time to running keeper) or Keeper is running at wrong Environment! Please comfirm! Enter [y]es or [n]o to continue.'.red)
  global.myvari.anslist = [{y: 'yes'}, {n: 'no'}]
  global.myvari.answer.yes = () => {
    ready.boot()
  }
  global.myvari.answer.no = () => {
    global.repls.close()
  }
}

function bootstrap () {
  require('./builder')
}
