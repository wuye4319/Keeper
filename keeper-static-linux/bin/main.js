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
  let myvar = global.myvari
  // temp handle model
  if (myvar.temphandle) {
    myvar.answer[myvar.temphandle](cmd.trim())
    myvar.temphandle = false
  } else {
    let anslist = myvar.anslist
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
      myvar.anslist = []
      typeof (anslist[indx]) === 'string' ? myvar.answer[anslist[indx]]() : myvar.answer[Object.values(anslist[indx])]()
    }
  }

  this.displayPrompt()
}

let plugname = 'keeper-static-linux'

// check program running environment.
let sysconf = path.resolve('./node_modules/' + plugname + '/config/sysconf.js')
let isready = fs.existsSync(sysconf)
if (isready) {
  let tempver = fs.readFileSync(path.join(__dirname, '/../../' + plugname + '/package.json')).toString()
  let currversion = JSON.parse(tempver).version
  console.log(plugname + ' : '.green + currversion.green)
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
  console.log(
    'This is a new Object (first time to running keeper) or Keeper is running at wrong Environment! Please comfirm! Enter [y]es or [n]o to continue.'.red)
  global.myvari.anslist = [{y: 'yes'}, {n: 'no'}]
  global.myvari.answer.yes = () => {
    ready.boot(plugname)
  }
  global.myvari.answer.no = () => {
    global.repls.close()
  }
}

function bootstrap () {
  require('./builder')
}
