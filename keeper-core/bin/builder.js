#!/usr/bin/env node
const colors = require('colors')
const r = require('repl')
let repls = r.start({prompt: '> ', eval: myEval})

const Fscache = require('../cache/cache')
let cache = new Fscache()

global.myvari = {anslist: [], answer: {}}

// listener
function myEval (cmd, context, filename, callback) {
  let anslist = global.myvari.anslist
  let indx = -1
  let mycmd
  for (let i in anslist) {
    mycmd = cmd.trim().split(' ')
    if (typeof (anslist[i]) === 'string') {
      if (anslist[i] === mycmd[0]) indx = i
    } else {
      if (Object.keys(anslist[i])[0] === mycmd[0]) indx = i
    }
  }
  if (indx === -1) {
    console.log('Invalid keyword!!!'.red)
  } else {
    global.myvari.anslist = []
    let args = mycmd.length > 1 ? mycmd[1] : ''
    typeof (anslist[indx]) === 'string' ? eval('myvari.answer.' + anslist[indx] + '(' + args + ')') : eval('myvari.answer.' +
      Object.values(anslist[indx]) + '(' + args + ')')
  }
  this.displayPrompt()
}

repls.defineCommand('clear', {
  help: 'clear cache file'.red,
  action: function (dir) {
    console.log('which dir do you wanna clear?')
    console.log('1.buy')
    console.log('2.error')
    console.log('3.taobao')
    global.myvari.anslist = [{1: 'buy'}, {2: 'error'}, {3: 'taobao'}]
    global.myvari.answer.buy = () => {
      this.getday('buy')
    }
    global.myvari.answer.subject = () => {
      this.getday('error')
    }
    global.myvari.answer.taobao = () => {
      this.getday('taobao')
    }
    this.getday = (type) => {
      console.log('how long do you wanna keep cache?enter : [m mins , like : m 20]')
      global.myvari.anslist = [{m: 'getday'}]
      // only answer
      global.myvari.answer.getday = (data) => {
        cache.delcache(type, data)
      }
    }
  }
})
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: function () {
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
