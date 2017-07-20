/**
 * Created by nero on 2017/4/5.
 */
var fsrobot = require('../lib/rob/robot');
var robot = new fsrobot();

repls.defineCommand("flash", {
    help: 'connect to mysql'.green,
    action: function (param) {
        robot.mysql();
        this.displayPrompt();
    }
})
repls.defineCommand("patrol", {
    help: 'connect to mysql'.green,
    action: function (param) {
        robot.mysql();
        this.displayPrompt();
    }
})
repls.defineCommand('rob', {
    help: 'a robot to check all page'.green,
    action: function (param) {
        robot.robot();
        this.displayPrompt();
    }
});