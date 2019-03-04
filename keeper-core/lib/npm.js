/**
 * author : nero
 */
const path = require('path'), fs = require('fs'), Writefile = require('./writefile')
let writefile = new Writefile
const Del = require('./delete')
let del = new Del, npm = require('npm'), Delay = require('./delay'), delay = new Delay
const Render = require('./render')
let render = new Render, lowplugin, heightplugin, lostplugin
const { exec } = require('child_process'), Progress = require('./progress')
let progress = new Progress

class initnpm {
  constructor() { this.pluginlist = [], this.currplugin = '' }

  init(a, b) { this.pluginlist = a, this.currplugin = b, this.boot() }

  async boot() {
    console.log('This is the first time to start keeper!'.green), this.checkplugin(), lowplugin.length &&
      (console.log('Some of your plug-ins version are too old, Keeper will update those plug-ins.'.red), await delay.delay(5,
        !0), await this.updateall(), this.checkplugin()), lostplugin.length &&
      (console.log('You have some plugin is missing, Keeper will install those plugin.'.red), await delay.delay(5,
        !0), await this.installall(), this.checkplugin())
  }

  async updateall() {
    let a = './package-lock.json'
    for (let b in fs.existsSync(a) && del.deleteSource(a), lowplugin) console.log('keeper update plugin : ' + lowplugin[b]), await this.installplugin(
      lowplugin[b]), await this.clearline(), await delay.delay(2, !0)
  }

  async installall() {
    for (let a in lostplugin) console.log('keeper installing plugin : ' + lostplugin[a]), await this.installplugin(
      lostplugin[a]), await this.clearline(), await delay.delay(2, !0)
  }

  checkplugin() {
    let a = this.pluginlist
    for (let b in lowplugin = [], heightplugin = [], lostplugin = [], a) {
      let c = -1 === a[b].ver.indexOf('-g') ? './node_modules/' + a[b].name + '/package.json' : path.join(__dirname, '/../../../../' + a[b].name +
        '/package.json')
      let d = fs.existsSync(c)
      if (d) {
        let e = fs.readFileSync(c).toString(), f = this.checkver(a[b].ver, JSON.parse(e).version)
        f && ('height' === f ? heightplugin.push(a[b].name) : lowplugin.push(a[b].name))
      } else lostplugin.push(a[b].name + '@' + a[b].ver)
    }
    if (lowplugin.length && console.log('Warning : outdataed version plugin : '.red + lowplugin.toString().red), heightplugin.length &&
      console.log('Warning : height version plugin : '.yellow + heightplugin.toString().yellow), lostplugin.length &&
      console.log('Missing plugin : '.yellow + lostplugin.toString().red), 0 === lostplugin.length && 0 === lowplugin.length) {
      console.log('Keeper is ready!'.green)
      let b = path.join(__dirname, '/../tpl/system/sysconf.txt'), c = path.resolve('./node_modules/' + this.currplugin + '/config/sysconf.js'),
        d = path.join(__dirname, '/../../../../' + this.currplugin + '/package.json')
      d = fs.existsSync(d) ? fs.readFileSync(d) : fs.readFileSync(path.join(__dirname, '/../../' + this.currplugin + '/package.json'))
      let e = fs.readFileSync(b).toString(), f = { timer: JSON.parse(d).version }, g = render.renderdata(e, f)
      writefile.writejs(c, g), this.bootstrap()
    }
  }

  installplugin(a) {
    return new Promise(c => {
      npm.load(function (d) {
        return d ? console.log(d) : void (-1 === a.indexOf('-g')
          ? npm.commands.install([a], function (e) { e && console.log(e), c() })
          : (progress.probytime(20), exec('npm install ' + a, { env: process.env, maxBuffer: 20971520 }, function (e, f, g) {
            progress.toend(), console.log(f), c(), g && console.log('stderr: ' + g), null !== e && console.log('exec error: ' + e)
          })))
      })
    })
  }

  clearline() { return new Promise(a => { console.log('Install Finished!'.green), a() }) }

  checkver(a, b) {
    let c = !1, d = a.split('.'), e = b.split('.')
    for (let f in d) if (parseInt(d[f]) > parseInt(e[f])) {
      c = !0
      break
    } else if (parseInt(e[f]) > parseInt(d[f])) {
      c = 'height'
      break
    }
    return c
  }

  bootstrap() { require(this.currplugin + '/bin/loader') }
}

module.exports = initnpm
