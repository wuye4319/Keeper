/**
 * Created by nero on 2017/3/23.
 */
var myctrlinit = require('../lib/ctrl/init')
myctrlinit = new myctrlinit()

var fsclear = require('../lib/ctrl/clear')
clear = new fsclear()//the bin/bdrelease.js used;

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
    static.static(this, param)
  }
})

repls.defineCommand('clear', {
  help: 'clear your object by config.json'.yellow,
  action: function (param) {
    clear.clear(param)
    this.displayPrompt()
  }
})

repls.defineCommand('init', {
  help: 'init your page'.yellow,
  action: function () {
    myctrlinit.init()
    this.displayPrompt()
  }
})

repls.defineCommand('initconf', {
  help: 'init your config.js'.yellow,
  action: function (type) {
    myctrlinit.initconf(type)
    this.displayPrompt()
  }
})

//create sth by moduel file
repls.defineCommand('createobject', {
  help: 'init your config.js'.yellow,
  action: function (type) {
    //myctrlinit.createobject(type);
    myvari.anslist = [{1: 'one'}, {2: 'two'}, {3: 'three'}]
    console.log('which kind of object do you wanna create?'.green)
    console.log('1.web frontend-react pc'.blue)
    console.log('2.html5 app frontend-react'.blue)
    console.log('3.frontend-react admin'.blue)
    myvari.answer.one = () => {
      console.log('11111111111')
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
    myctrlinit.initrout()
    this.displayPrompt()
  }
})