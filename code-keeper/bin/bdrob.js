/**
 * Created by nero on 2017/4/5.
 */
const Fsrobot = require('../lib/rob/robot')
let robot = new Fsrobot()

const Proter = require('../lib/rob/porter')
let proter = new Proter()

repls.defineCommand('flash', {
  help: 'connect to mysql'.green,
  action: function (param) {
    robot.mysql()
    this.displayPrompt()
  }
})
repls.defineCommand('patrol', {
  help: 'connect to mysql'.green,
  action: function (param) {
    robot.mysql()
    this.displayPrompt()
  }
})
repls.defineCommand('rob', {
  help: 'a robot to check all page'.green,
  action: function (param) {
    robot.robot()
    this.displayPrompt()
  }
})

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
