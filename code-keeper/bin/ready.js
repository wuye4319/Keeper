/**
 * Created by nero on 2017/6/29.
 * ready
 */
const path = require('path')
var writefile = require('../lib/base/writefile')
writefile = new writefile()
var exec = require('child_process').exec
var npm
if (fs.existsSync('./node_modules/npm/')) {
  npm = require('npm')
}
let Delay = require('../lib/base/delay')
let delay = new Delay()
var render = require('../lib/base/render')
render = new render()
var lowplugin, heightplugin, lostplugin

class ready {
  constructor () {
    this.pluginlist = [
      {name: 'babel-core', ver: '6.25.0'},
      {name: 'babel-preset-env', ver: '1.5.2'},
      {name: 'babel-preset-react', ver: '6.24.1'},
      {name: 'babel-preset-stage-0', ver: '6.24.1'},
      {name: 'css-loader', ver: '0.28.4'},
      {name: 'less-loader', ver: '4.0.4'},
      {name: 'style-loader', ver: '0.18.2'},
      {name: 'url-loader', ver: '0.5.9'},
      {name: 'babel-loader', ver: '7.1.1'},
      {name: 'antd', ver: '2.12.2'},
      {name: 'webpack', ver: '3.0.0'},
      {name: 'react-router', ver: '3.0.0'}, // 4.1.2
      {name: 'i18n-webpack-plugin', ver: '1.0.0'},
      {name: 'babel-plugin-import', ver: '1.2.1'}
    ]
  }

  async boot () {
    console.log('This is the first time to start keeper!'.green)
    fs.existsSync('./config.js') || addconf()
    fs.existsSync('./seoinfor.json') || addconf('seo')
    this.checkplugin()// keeper will auto install plugin for you,please wait...
    if (lowplugin.length || heightplugin.length) {
      console.log('You have some plugin is incorrect,Keeper will uninstall those plugin.'.red)
      let hasnpm = fs.existsSync('./node_modules/npm/package.json')
      hasnpm || await this.installnpm()
      await delay.delay(5, true)
      await this.uninstallall()
      this.checkplugin()
    }
    if (lostplugin.length) {
      console.log('You have some plugin is missing,Keeper will install those plugin.'.red)
      let hasnpm = fs.existsSync('./node_modules/npm/package.json')
      hasnpm || await this.installnpm()
      await delay.delay(5, true)
      await this.installall()
      this.checkplugin()
    }
  }

  async uninstallall () {
    lowplugin = lowplugin.concat(heightplugin)
    for (let i in lowplugin) {
      console.log('keeper uninstalling plugin : ' + lowplugin[i])
      await this.installplugin(lowplugin[i], 'un')
      await this.clearline()
      await delay.delay(2, true)
    }
  }

  async installall () {
    for (let i in lostplugin) {
      console.log('keeper installing plugin : ' + lostplugin[i])
      await this.installplugin(lostplugin[i])
      await this.clearline()
      await delay.delay(2, true)
    }
  }

  checkplugin () {
    let pluginlist = this.pluginlist
    lowplugin = [], heightplugin = [], lostplugin = []
    for (var i in pluginlist) {
      let isexist = fs.existsSync('./node_modules/' + pluginlist[i].name + '/package.json')
      if (isexist) {
        var str = fs.readFileSync('./node_modules/' + pluginlist[i].name + '/package.json').toString()
        var low = this.checkver(pluginlist[i].ver, JSON.parse(str).version)
        if (low) {
          low == 'height' ? heightplugin.push(pluginlist[i].name) : lowplugin.push(pluginlist[i].name)
        }
      } else {
        lostplugin.push(pluginlist[i].name + '@' + pluginlist[i].ver)
      }
    }
    if (lowplugin.length) {
      console.log('Warning : outdataed version plugin : '.yellow + lowplugin.toString().red)
    }
    if (heightplugin.length) {
      console.log('Warning : height version plugin : '.yellow + heightplugin.toString().red)
    }
    if (lostplugin.length) {
      console.log('Missing plugin : '.yellow + lostplugin.toString().red)
    }
    if (lostplugin.length == 0 && heightplugin.length == 0 && lowplugin.length == 0) {
      console.log('Keeper is ready!'.green)
      var inconf = path.join(__dirname, '/../tpl/system/sysconf.txt')
      var outconf = path.join(__dirname, '/../config/sysconf.js')

      var tpl = fs.readFileSync(inconf).toString()
      var data = {timer: 1}
      var str = render.renderdata(tpl, data)
      var newfile = writefile.writejs(outconf, str)
    }
  }

  installplugin (plugin, type) {
    return new Promise((resolve) => {
      npm.load(function (err) {
        if (err) return console.log(err)
        if (type === 'un') {
          npm.commands.uninstall([plugin], function (er, data) {
            if (er) console.log(er)
            resolve()
          })
        } else {
          npm.commands.install([plugin], function (er, data) {
            if (er) console.log(er)
            resolve()
          })
        }
      })
    })
  }

  clearline () {
    return new Promise((resolve) => {
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
      console.log('Finished!'.green)
      resolve()
    })
  }

  checkver (myver, cver) {
    var result = false
    var myvers = myver.split('.')
    var cvers = cver.split('.')
    // control version .2
    for (var i = 0; i < myvers.length - 1; i++) {
      if (parseInt(myvers[i]) > parseInt(cvers[i])) {
        result = true
        break
      } else if (parseInt(cvers[i]) > parseInt(myvers[i])) {
        result = 'height'
        break
      }
    }
    return result
  }

  installnpm () {
    return new Promise((resolve) => {
      console.log('Keeper is preparing the installation resource for you,Please wait...'.green)
      exec('npm install npm@5.0.4', function (error, stdout, stderr) {
        console.log(stdout)
        stderr ? console.log('stderr: ' + stderr) : console.log('keeper is ready!'.green)
        npm = require('npm')
        if (error !== null) {
          console.log('exec error: ' + error)
        }
        resolve()
      })
    })
  }

  addconf (type) {
    var inconf, outconf
    if (type === 'seo') {
      inconf = __dirname + '/../tpl/system/seoinfor.json'
      outconf = './seoinfor.json'
    } else {
      inconf = __dirname + '/../tpl/config-front.js'
      outconf = './config.js'
    }
    var str = fs.readFileSync(inconf).toString()
    var newfile = writefile.writejs(outconf, str)
    newfile ? console.log(outconf.yellow + ' is init success!'.green) : console.log(outconf.red + ' is failed to init!'.red)
    console.log('this is first loading! keeper is setting complete! please open again!'.green)
  }
}

module.exports = ready
