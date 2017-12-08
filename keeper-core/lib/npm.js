/**
 * Created by nero on 2017/6/29.
 * ready
 */
const path = require('path')
const fs = require('fs')
const Writefile = require('./writefile')
let writefile = new Writefile()
const exec = require('child_process').exec
const Del = require('./delete')
let del = new Del()
let npm
if (fs.existsSync('./node_modules/npm/')) {
  npm = require('npm')
}
let Delay = require('./delay')
let delay = new Delay()
const Render = require('./render')
let render = new Render()
let lowplugin, heightplugin, lostplugin

class initnpm {
  constructor () {
    this.pluginlist = []
    this.currplugin = ''
  }

  init (parm, plugin) {
    this.pluginlist = parm
    this.currplugin = plugin
    this.boot()
  }

  async boot () {
    console.log('This is the first time to start keeper!'.green)
    this.checkplugin()// keeper will auto install plugin for you,please wait...
    if (lowplugin.length) {
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
    let packagelock = './package-lock.json'
    if (fs.existsSync(packagelock)) del.deleteSource(packagelock)
    // lowplugin = lowplugin.concat(heightplugin)
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
    lowplugin = []
    heightplugin = []
    lostplugin = []
    for (var i in pluginlist) {
      let isexist = fs.existsSync('./node_modules/' + pluginlist[i].name + '/package.json')
      if (isexist) {
        var str = fs.readFileSync('./node_modules/' + pluginlist[i].name + '/package.json').toString()
        var low = this.checkver(pluginlist[i].ver, JSON.parse(str).version)
        if (low) {
          low === 'height' ? heightplugin.push(pluginlist[i].name) : lowplugin.push(pluginlist[i].name)
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
    if (lostplugin.length === 0 && lowplugin.length === 0) {
      console.log('Keeper is ready!'.green)
      let inconf = path.join(__dirname, '/../tpl/system/sysconf.txt')
      let outconf = path.join(__dirname, '/../../' + this.currplugin + '/config/sysconf.js')

      let tpl = fs.readFileSync(inconf).toString()
      let data = {timer: 1}
      let mystr = render.renderdata(tpl, data)
      writefile.writejs(outconf, mystr)
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
}

module.exports = initnpm
