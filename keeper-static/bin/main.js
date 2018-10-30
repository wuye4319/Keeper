#!/usr/bin/env node
let fs = require('fs')
let path = require('path')
const Fslog = require('../base/logger')
let logger = new Fslog()

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
      logger.myconsole('Invalid keyword!!!')
    } else {
      myvar.anslist = []
      typeof (anslist[indx]) === 'string' ? myvar.answer[anslist[indx]]() : myvar.answer[Object.values(anslist[indx])]()
    }
  }

  this.displayPrompt()
}

require('./builder')
