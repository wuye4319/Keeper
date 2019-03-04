/**
 * Created by nero on 2019/1/22.
 * get user infor
 */
const inquirer = require('inquirer');
let fs = require('fs')
let path = require('path')
const Initnpm = require('keeper-core/lib/npm')
let mynpm = new Initnpm()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

class infor {
  checkplugin(plugin, readyconfig) {
    this.initpro(readyconfig)
    mynpm.init(readyconfig.pluginlist, plugin)
  }

  initpro(readyconfig) {
    let initfile = readyconfig.initfile

    for (let i in initfile) {
      if (!fs.existsSync(initfile[i].in)) {
        let inconf = path.join(__dirname, '/../tpl/system/' + initfile[i].out)
        let outconf = initfile[i].in
        writefile.copy(inconf, outconf)
      }
    }
  }

  bootstrap(plugin, readyconfig) {
    const promptList = [{
      type: 'Confirm',
      message: '检测到新项目，请确认当前环境为根目录:[y/n]',
      name: 'boot',
      default: 'y'
    }];

    inquirer.prompt(promptList).then(a => {
      if (a.boot === 'y') {
        this.checkplugin(plugin, readyconfig)
      } else if (a.boot !== 'n') {
        console.log('输入无效！')
      }
    })
  }

  boot(plugname, readyconfig, fn) {
    // check program running environment.
    let sysconf = path.resolve('./node_modules/' + plugname + '/config/sysconf.js')
    let isready = fs.existsSync(sysconf)
    if (isready) {
      let tempver = fs.readFileSync(path.resolve('./node_modules/' + plugname + '/package.json')).toString()
      let currversion = JSON.parse(tempver).version
      // console.log(plugname + ' : '.green + currversion.green)
      let preversion = require(sysconf)
      if (preversion.check_env === currversion) {
        fn()
      } else {
        this.bootstrap(plugname, readyconfig)
      }
    } else {
      this.bootstrap(plugname, readyconfig)
    }
  }
}

module.exports = infor