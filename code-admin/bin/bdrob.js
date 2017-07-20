/**
 * Created by nero on 2017/4/5.
 */
var fsrobot = require('../lib/myrob/robot');
var robot = new fsrobot();

repls.defineCommand('rob', {
    help: 'a robot to do sth for you'.green,
    action: function (param) {
        robot.robot();
        this.displayPrompt();
    }
});