/**
 * Created by nero on 2017/3/23.
 */
const Ctrlinit = require('../lib/ctrl/init')
let ctrlinit = new Ctrlinit()

const Fsclear = require('../lib/ctrl/clear')
let clear = new Fsclear()//the bin/bdrelease.js used;

let fsstatic = require('../lib/ctrl/static')
let static = new fsstatic()

let fsconf = require('../lib/ctrl/readconf')
let conf = new fsconf()

repls.defineCommand('conf', {
  help: 'setting config of config.js'.green,
  action: function (param) {
    conf.conf(param)
    this.displayPrompt()
  }
})

repls.defineCommand('static', {
  help: 'static your html'.yellow,
  action: function (param) {
    console.log('This function is temporarily unavailable!'.red)
    // static.static(this, param)
  }
})

repls.defineCommand('clear', {
  help: 'clear your object by config.json'.yellow,
  action: function (param) {
    if (clear.checkrouter()) {
      console.log('Do you wanna clear all files of this router? Please confirm. Enter [y]es or [n]o to continue...'.red)
      myvari.anslist = [{y: 'yes'}, {n: 'no'}]
      myvari.answer.yes = () => {
        clear.clear(param)
      }
    } else {
      clear.clear(param)
    }

    this.displayPrompt()
  }
})

repls.defineCommand('init', {
  help: 'init your page'.yellow,
  action: function () {
    ctrlinit.init()
    this.displayPrompt()
  }
})

repls.defineCommand('initconf', {
  help: 'init your config.js'.yellow,
  action: function (type) {
    ctrlinit.initconf(type)
    this.displayPrompt()
  }
})

//create sth by moduel file
repls.defineCommand('createobject', {
  help: 'init your config.js'.yellow,
  action: function (type) {
    //ctrlinit.createobject(type);
    myvari.anslist = [{1: 'one'}, {2: 'two'}, {3: 'three'}]
    console.log('which kind of object do you wanna create?'.green)
    console.log('1.web frontend-react pc'.blue)
    console.log('2.html5 app frontend-react'.blue)
    console.log('3.frontend-react admin'.blue)
    myvari.answer.one = () => {
      console.log('11111111111')
      myvari.temphandle = 'test'
      myvari.answer.test = (data) => {
        console.log('test' + data)
      }
    }
    myvari.answer.two = () => {
      console.log('22222222222')
    }
    myvari.answer.three = () => {
      console.log('33333333333')
    }
    this.displayPrompt()
  }
})

repls.defineCommand('initrouter', {
  help: 'search dir and rewrite router file and routername'.green,
  action: function () {
    ctrlinit.initrout()
    this.displayPrompt()
  }
})