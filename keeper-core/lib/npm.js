/**
 * Created by nero on 2017/6/29.
 * ready
 */
const path = require('path')
const fs = require('fs')
const Writefile = require('./writefile')
let writefile = new Writefile()
// const Del = require('./delete')
// let del = new Del()
let npm = require('npm')
const Render = require('./render')
let render = new Render()
let heightplugin, lostplugin
const {
  spawnSync
} = require('child_process');

class initnpm {
  constructor() {
    this.pluginlist = []
    this.currplugin = ''
  }

  // parm 插件列表，plugin name
  init(parm, plugin, type, part) {
    this.pluginlist = parm
    this.currplugin = plugin
    this.boot(type, part)
  }

  async boot(plugintype, part) {
    console.log('This is the first time to start keeper!'.green)
    this.checkplugin(plugintype) // keeper will auto install plugin for you,please wait...
    // if (lowplugin.length) {
    //   console.log('Some of your plug-ins version are too old, Keeper will update those plug-ins.'.red)
    //   await this.updateall(part)
    // }
    if (lostplugin.length) {
      console.log('You have some plugin is missing, Keeper will install those plugin.'.red)
      await this.installall(part, lostplugin)
    }
    this.checkplugin(plugintype)
  }

  // async updateall(part) {
  //   let packagelock = './package-lock.json'
  //   if (fs.existsSync(packagelock)) del.deleteSource(packagelock)
  //   // lowplugin = lowplugin.concat(heightplugin)

  //   this.installall(part, lowplugin)
  // }

  async installall(part, lostplugin) {
    if (part) { // special
      // merge plugin
      let allplugin = lostplugin.join(' ')
      console.log('keeper installing all plugin : ' + allplugin)
      await this.installpluginonce(allplugin)
    } else {
      for (let i in lostplugin) {
        console.log('keeper installing part plugin : ' + lostplugin[i])
        await this.installplugin(lostplugin[i])
      }
    }
    console.log('Install Finished!'.green)
  }

  checkplugin(plugintype) {
    let listkey = Object.keys(this.pluginlist)
    let listval = Object.values(this.pluginlist)
    // lowplugin = []
    heightplugin = []
    lostplugin = []
    for (let i in listkey) {
      let packagepath
      if (listval[i].indexOf('-g') !== -1) {
        packagepath = path.join(__dirname, '/../../../../' + listkey[i] + '/package.json')
      } else {
        packagepath = './node_modules/' + listkey[i] + '/package.json'
      }

      let isexist = fs.existsSync(packagepath)
      if (isexist) {
        let str = fs.readFileSync(packagepath).toString()
        let low = this.checkver(listval[i], JSON.parse(str).version)
        if (low) {
          low === 'height' ? heightplugin.push(listkey[i] + '@' + listval[i]) :
            lostplugin.push(listkey[i] + '@' + listval[i])
        }
      } else {
        lostplugin.push(listkey[i] + '@' + listval[i])
      }
    }
    // if (lowplugin.length) {
    //   console.log('Warning : outdataed version plugin : '.red + lowplugin.toString().red)
    // }
    if (heightplugin.length) {
      console.log('Warning : height version plugin : '.yellow + heightplugin.toString().yellow)
    }
    if (lostplugin.length) {
      console.log('Missing plugin : '.yellow + lostplugin.toString().red)
    }
    if (lostplugin.length === 0) {
      console.log('Keeper is ready!'.green)

      let plugver = path.join(__dirname, '/../../../../' + this.currplugin + '/package.json')
      if (fs.existsSync(plugver)) {
        plugver = fs.readFileSync(plugver)
      } else {
        plugver = fs.readFileSync(path.join(__dirname, '/../../' + this.currplugin + '/package.json'))
      }

      // write version
      let inconf = path.join(__dirname, '/../tpl/system/sysconf.txt')
      let outconf = path.resolve('./node_modules/' + this.currplugin + '/config/sysconf.js')
      let tpl = fs.readFileSync(inconf).toString()
      let data = {
        timer: JSON.parse(plugver).version,
        type: plugintype
      }
      let mystr = render.renderdata(tpl, data)
      writefile.writejs(outconf, mystr)

      this.bootstrap()
    }
  }

  installplugin(plugin) {
    return new Promise((resolve) => {
      npm.load(function (err) {
        if (err) return console.log(err)
        if (plugin.indexOf('-g') !== -1) {
          npm.config.set('global', true)
        }
        npm.commands.install([plugin], function (er, data) {
          if (er) console.log(er)
          resolve()
          if (plugin.indexOf('-g') !== -1) {
            npm.config.set('global', false)
          }
        })
      })
    })
  }

  installpluginonce(plugin) {
    return new Promise((resolve) => {
      let data = spawnSync('npm', ['i', plugin], {
        stdio: 'inherit'
      });
      resolve(data)
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
    require(this.currplugin + '/bin/loader')
  }
}

module.exports = initnpm