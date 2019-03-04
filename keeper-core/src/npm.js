/**
 * Created by nero on 2017/6/29.
 * ready
 */
const path = require('path')
const fs = require('fs')
const Writefile = require('./writefile')
let writefile = new Writefile()
const Del = require('./delete')
let del = new Del()
let npm = require('npm')
let Delay = require('./delay')
let delay = new Delay()
const Render = require('./render')
let render = new Render()
let lowplugin, heightplugin, lostplugin
const { spawn } = require('child_process')
const Progress = require('./progress')
let progress = new Progress()

class initnpm {
  constructor() {
    this.pluginlist = []
    this.currplugin = ''
  }

  init(parm, plugin) {
    this.pluginlist = parm
    this.currplugin = plugin
    this.boot()
  }

  async boot() {
    console.log('This is the first time to start keeper!'.green)
    this.checkplugin()// keeper will auto install plugin for you,please wait...
    if (lowplugin.length) {
      console.log('Some of your plug-ins version are too old, Keeper will update those plug-ins.'.red)
      // let hasnpm = fs.existsSync('./node_modules/npm/package.json')
      // hasnpm || await this.installnpm()
      await delay.delay(5, true)
      await this.updateall()
      this.checkplugin()
    }
    if (lostplugin.length) {
      console.log('You have some plugin is missing, Keeper will install those plugin.'.red)
      // let hasnpm = fs.existsSync('./node_modules/npm/package.json')
      // hasnpm || await this.installnpm()
      await delay.delay(5, true)
      await this.installall()
      this.checkplugin()
    }
  }

  async updateall() {
    let packagelock = './package-lock.json'
    if (fs.existsSync(packagelock)) del.deleteSource(packagelock)
    // lowplugin = lowplugin.concat(heightplugin)
    for (let i in lowplugin) {
      console.log('keeper update plugin : ' + lowplugin[i])
      await this.installplugin(lowplugin[i])
      await this.clearline()
      await delay.delay(2, true)
    }
  }

  async installall() {
    for (let i in lostplugin) {
      console.log('keeper installing plugin : ' + lostplugin[i])
      await this.installplugin(lostplugin[i])
      await this.clearline()
      await delay.delay(2, true)
    }
  }

  checkplugin() {
    let pluginlist = this.pluginlist
    lowplugin = []
    heightplugin = []
    lostplugin = []
    for (let i in pluginlist) {
      let packagepath
      if (pluginlist[i].ver.indexOf('-g') !== -1) {
        packagepath = path.join(__dirname, '/../../../../' + pluginlist[i].name + '/package.json')
      } else {
        packagepath = './node_modules/' + pluginlist[i].name + '/package.json'
      }
      let isexist = fs.existsSync(packagepath)
      if (isexist) {
        let str = fs.readFileSync(packagepath).toString()
        let low = this.checkver(pluginlist[i].ver, JSON.parse(str).version)
        if (low) {
          low === 'height' ? heightplugin.push(pluginlist[i].name) : lowplugin.push(pluginlist[i].name)
        }
      } else {
        lostplugin.push(pluginlist[i].name + '@' + pluginlist[i].ver)
      }
    }
    if (lowplugin.length) {
      console.log('Warning : outdataed version plugin : '.red + lowplugin.toString().red)
    }
    if (heightplugin.length) {
      console.log('Warning : height version plugin : '.yellow + heightplugin.toString().yellow)
    }
    if (lostplugin.length) {
      console.log('Missing plugin : '.yellow + lostplugin.toString().red)
    }
    if (lostplugin.length === 0 && lowplugin.length === 0) {
      console.log('Keeper is ready!'.green)
      let inconf = path.join(__dirname, '/../tpl/system/sysconf.txt')
      let outconf = path.resolve('./node_modules/' + this.currplugin + '/config/sysconf.js')
      let plugver = path.join(__dirname, '/../../../../' + this.currplugin + '/package.json')
      if (fs.existsSync(plugver)) {
        plugver = fs.readFileSync(plugver)
      } else {
        plugver = fs.readFileSync(path.join(__dirname, '/../../' + this.currplugin + '/package.json'))
      }

      let tpl = fs.readFileSync(inconf).toString()
      let data = { timer: JSON.parse(plugver).version }
      let mystr = render.renderdata(tpl, data)
      writefile.writejs(outconf, mystr)

      this.bootstrap()
    }
  }

  installplugin(plugin, type) {
    return new Promise((resolve) => {
      npm.load(function (err) {
        if (err) return console.log(err)
        if (plugin.indexOf('-g') !== -1) {
          // progress.probytime(20)
          // let ls = exec('npm install ' + plugin, { env: process.env, maxBuffer: 20 * 1024 * 1024 }, function (error, stdout, stderr) {
          //   // progress.toend()
          //   console.log(stdout)
          //   resolve()
          //   if (stderr) console.log('stderr: ' + stderr)
          //   if (error !== null) {
          //     console.log('exec error: ' + error)
          //   }
          // })
          npm.config.set('global', true)
          npm.commands.install(['webpack@3.10.0'], function (er, data) {
            if (er) console.log(er)
            resolve()
            npm.config.set('global', false)
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

  clearline() {
    let self = this
    return new Promise((resolve) => {
      repls.displayPrompt()
      console.log('Install Finished!'.green)
      resolve()
    })
  }

  checkver(myver, cver) {
    let result = false
    let myvers = myver.split('.')
    let cvers = cver.split('.')
    // control version .2
    for (let i in myvers) {
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

  bootstrap() {
    require(this.currplugin + '/bin/builder')
  }
}

module.exports = initnpm
