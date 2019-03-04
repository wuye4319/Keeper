/**
 * Created by nero on 2017/4/5.
 */
const Proter = require('code-keeper2/lib/rob/porter')
let proter = new Proter()

global.repls.defineCommand('proter-less', {
  help: 'proter of less'.yellow,
  action: function () {
    proter.moveless()
    this.displayPrompt()
  }
})
global.repls.defineCommand('proter-trans', {
  help: 'proter of less'.yellow,
  action: function () {
    proter.trans()
    this.displayPrompt()
  }
})

/**
 * Created by nero on 2017/3/23.
 */
const Fsrelease = require('../lib/ctrl/release')
let release = new Fsrelease()
const Fsvers = require('../lib/ctrl/version')
let vers = new Fsvers()

// check version
vers.checkconf()

repls.defineCommand('v', {
  help: 'version'.yellow,
  action: function () {
    vers.vers()
    this.displayPrompt()
  }
})

global.repls.defineCommand('release', {
  help: 'package source for release'.green,
  action: function (param) {
    console.log('do you wanna cleaning dir "release" first?([y]es or [n]o)')
    myvari.anslist = [{y: 'yes'}, {n: 'no'}]
    myvari.answer.yes = () => {
      clear.clear('r')
      setTimeout(function () {
        console.log('dir is cleaning,please enter "c" to continue'.red)
      }, 900)
      myvari.anslist = [{c: 'conti'}]
      myvari.answer.conti = () => {
        release.release(param)
      }
    }
    myvari.answer.no = () => {
      release.release(param)
    }
    this.displayPrompt()
  }
})
