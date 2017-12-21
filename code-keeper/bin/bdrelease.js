/**
 * Created by nero on 2017/3/23.
 */
var fsrelease = require('../lib/ctrl/release')
var release = new fsrelease()

var fsvers = require('../lib/ctrl/version')
var vers = new fsvers()

// check version
var check = vers.checkconf()

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
