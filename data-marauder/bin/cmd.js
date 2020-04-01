// proxy taobao
const Proxy = require('../lib/proxy')
let proxy = new Proxy()
const Ctrl = require('../router/operation/ctrl')
let ctrl = new Ctrl()
proxy.init()
proxy.initproxybrowser()

const Action = require('../router/service/action')
let action = new Action()
const Robot = require('../lib/myrob/robot')
let robot = new Robot()
let path = require('path')
const Fsdel = require('keeper-core/lib/delete')
let del = new Fsdel()

let simgroutname = 'simagenav'
const Center = require('../lib/mining/center')
let center = new Center()
const Base64 = require('../lib/writebase64')
let base64 = new Base64()

let cmdlist = [
  {
    name: 'clear', desc: 'Clear all cache, confirm your opration carefully',
    action: function () {
      let mycache = path.join(__dirname, '../../../cache/')
      del.deleteSource(mycache, 'all')
    }
  }, {
    name: 'rob', desc: 'a robot to do sth for you',
    action: function () {
      robot.robot()
    }
  }, {
    name: 'data', desc: 'Get data',
    action: function () {
      let mycache = path.join(__dirname, '../../../cache/')
      del.deleteSource(mycache, 'all')
      let analysis = path.join(__dirname, '../../../analysis/')
      del.deleteSource(analysis, 'all')
      let url = 'https://www.kongjie.space/thread-10952336-1-1.html'
      action.getimg(url, simgroutname)
    }
  }, {
    name: 'mining <isdownload>', desc: 'Get image',
    action: function (isdownload) {
      if (isdownload) {
        center.getdata(simgroutname, isdownload)
      } else {
        center.getdata(simgroutname)
      }
    }
  }, {
    name: 'base64', desc: 'write base64 to file',
    action: function () {
      base64.tofile()
    }
  }, {
    name: 'clearprocess', desc: '清理进程',
    action: function () {
      ctrl.clearinternumb()
    }
  }, {
    name: 'ipinterval <time>', desc: '设置IP切换时间',
    action: function (time) {
      if (time) {
        proxy.setipinterval(time)
      } else {
        console.log('please enter time!'.red)
      }
    }
  }, {
    name: 'auto-login <account>', desc: '自动登录账号',
    action: function (account) {
      let tempPro = 'https://detail.tmall.com/item.htm?id=554802892200'
      // let tempPro = 'https://www.tmall.com/'
      let url = 'https://login.tmall.com/?from=sm&redirectURL='
      proxy.login(url, tempPro, account || 0)
    }
  }, {
    name: 'manualchangeip', desc: 'Close active change ip, and manual change ip by index',
    action: function () {
      await proxy.manualchangeip()
    }
  }, {
    name: 'autoproxy', desc: 'Auto active change ip', alias: 'crt',
    action: function () {
      await proxy.autoproxy()
    }
  }
]

module.exports = cmdlist