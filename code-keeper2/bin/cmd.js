const Fscompile = require('../lib/compile')
let compile = new Fscompile()
const Ctrlinit = require('../lib/ctrl/init')
let ctrlinit = new Ctrlinit()
const Fsclear = require('../lib/ctrl/clear')
let clear = new Fsclear() //the bin/bdrelease.js used;
// let fsstatic = require('../lib/ctrl/static')
// let static = new fsstatic()
let fsconf = require('../lib/ctrl/readconf')
let conf = new fsconf()
// require('./rob')

let cmdlist = [
  {
    name: 'dev', desc: '开发编译',
    action: function () {
      compile.dev()
      console.log('dev')
    }
  }, {
    name: 'pub', desc: '发布编译',
    action: function () {
      compile.pub()
    }
  }, {
    name: 'wrap', desc: '编译wrapper',
    option: [{ cmd: '-p, --public', desc: 'build wrapper for public envs' }],
    action: function (cmd) {
      compile.wrap(cmd.public)
    }
  }, {
    name: 'conf', desc: '查看配置',
    action: function () {
      conf.conf(false)
    }
  }, {
    name: 'create', desc: 'create page', alias: 'crt',
    action: function () {
      ctrlinit.init()
    }
  }, {
    name: 'initconf', desc: 'init config.js', alias: 'inc',
    option: [{ cmd: '-a, --admin', desc: 'config.js for admin' }],
    action: function (cmd) {
      ctrlinit.initconf(cmd.admin) // true
    }
  }, {
    name: 'initrouter', desc: '初始化router', alias: 'inr',
    action: function () {
      ctrlinit.initrout()
    }
  }, {
    name: 'static', desc: '正静态', alias: 'stc',
    action: function () {
      console.log('This function is temporarily unavailable!'.red)
      // static.static(this, param)
    }
  }, {
    name: 'clear', desc: '文件清理', alias: 'clr',
    action: function () {
      // clear.checkrouter()
      clear.clear()
    }
  }
]

module.exports = cmdlist