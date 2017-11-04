/**
 * Created by nero on 2017/3/23.
 */
const Proter = require('../lib/rob/porter')
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