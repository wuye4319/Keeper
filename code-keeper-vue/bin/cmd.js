/**
 * Created by nero on 2018/5/29.
 */

const Fscompile = require('../lib/compile')
let compile = new Fscompile()
const Create = require('../lib/ctrl/create')
let create = new Create()
// the bin/bdrelease.js used;
const Fsclear = require('../lib/ctrl/clear')
let clear = new Fsclear()
// let fsconf = require('../lib/ctrl/readconf')
// let conf = new fsconf()
// require('./rob')
const path = require('path')
let pwd = path.dirname(__dirname)
let plugname = path.basename(pwd)
let outconf = path.resolve('./node_modules/' + plugname + '/config/sysconf.js')
let tpl = require(outconf)
const npmrun = require('../lib/run')
let run = new npmrun()
const Service = require('./service')
let service = new Service()

module.exports = [
  {
    name: 'dev', desc: '开发编译',
    action: function () {
      if (tpl.plugintype === 'vue-webpack') {
        compile.dev()
      } else if (tpl.plugintype === 'vue-cli-service') {
        service.run('serve')
      }
    }
  }, {
    name: 'pub', desc: '发布编译',
    action: function () {
      if (tpl.plugintype === 'vue-webpack') {
        compile.pub()
      } else if (tpl.plugintype === 'vue-cli-service') {
        service.run('build')
      }
    }
  }, {
    name: 'inspect', desc: '检查webpack的配置', alias: 'ins',
    action: function () {
      service.run('inspect')
    }
  }, {
    name: 'registry', desc: 'npm源管理', alias: 'reg',
    action: function () {
      run.choosereg()
    }
  }, {
    name: 'init', desc: 'init object',
    action: function () {
      create.createObj()
    }
  }, {
    name: 'create', desc: 'create', alias: 'crt',
    option: [
      { cmd: '-c, --component', desc: 'create component' },
      { cmd: '-a, --actions', desc: 'create action' },
      { cmd: '-p, --page', desc: 'create page' },
    ],
    action: function (cmd) {
      let env = create.checkenv()
      if (env) {
        if (cmd.page) {
          create.createPage()
        } else if (cmd.actions) {
          create.createAction()
        } else if (cmd.component) {
          create.createComponent()
        }
      }
    }
  }, {
    name: 'clear', desc: '文件清理', alias: 'clr',
    option: [
      { cmd: '-c, --component', desc: 'clear component' },
      { cmd: '-a, --actions', desc: 'clear action' },
      { cmd: '-p, --page', desc: 'clear page' },
    ],
    action: function (cmd) {
      let env = create.checkenv()
      if (env) {
        if (cmd.page) {
          clear.clearPage()
        } else if (cmd.actions) {
          clear.clearAction()
        } else if (cmd.component) {
          clear.clearComponent()
        }
      }
    }
  }
]
