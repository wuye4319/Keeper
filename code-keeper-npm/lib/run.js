const npm = require('npm')
const inquirer = require('inquirer');

module.exports = class {
  constructor() {
    this.init = {
      reglist: {
        npm: 'https://registry.npmjs.org/',
        cnpm: 'http://r.cnpmjs.org/',
        taobao: 'https://registry.npm.taobao.org/',
        authine: 'http://120.78.157.233:8888/repository/npm-all/'
      }
    }
  }

  getindex(arr, val) {
    for (let i in arr) {
      if (arr[i] === val) return i
    }
  }

  async choosereg() {
    let currReg = await this.getreg()
    let valList = Object.values(this.init.reglist)
    let index = this.getindex(valList, currReg)

    const promptList = [{
      type: 'list',
      message: '请选择npm库源:',
      name: 'reg',
      default: parseInt(index) || 0,
      choices: [
        'npm --- https://registry.npmjs.org/',
        'cnpm --- http://r.cnpmjs.org/',
        'taobao --- https://registry.npm.taobao.org/',
        'authine --- http://120.78.157.233:8888/repository/npm-all/'
      ]
    }]

    inquirer.prompt(promptList).then(async a => {
      let reg=a.reg.split(' --- ')[0]
      let val = this.init.reglist[reg]
      this.setreg(val)
      let currReg = await this.getreg()
      console.log('\n已切换到：')
      console.log(a.reg + ' --- ' + currReg + '\n')
    })
  }

  async getreg() {
    return new Promise((resolve) => {
      npm.load(function (err) {
        if (err) return console.log(err)
        var newreg = npm.config.get('registry')
        resolve(newreg)
      })
    })
  }

  setreg(val) {
    npm.load(function (err) {
      if (err) return console.log(err)
      npm.commands.config(['set', 'registry', val], function (err) {
        if (err) return exit(err)
      })
    })
  }

  run(key) {
    npm.load(function (err) {
      if (err) return console.log(err)
      npm.commands.run([key], function (er) {
        if (er) console.log(er)
      })
    })
  }
}
