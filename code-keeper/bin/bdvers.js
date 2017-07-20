/**
 * Created by nero on 2017/3/23.
 */
var fsvers = require('../lib/ctrl/version');
var vers = new fsvers();

//check version
var check = vers.checkconf();

repls.defineCommand('v', {
    help: 'version'.yellow,
    action: function () {
        vers.vers();
        this.displayPrompt();
    }
});