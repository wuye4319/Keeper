/**
 * Created by nero on 2017/3/23.
 */
var fsrelease = require('../lib/ctrl/release');
var release = new fsrelease();

repls.defineCommand('release', {
    help: 'package source for release'.green,
    action: function (param) {
        console.log("do you wanna cleaning dir \"release\" first?([y]es or [n]o)");
        yes = function () {
            clear.clear("r");
            setTimeout(function () {
                console.log("dir is cleaning,please enter \"c\" to continue".red);
            }, 900)
            conti = function () {
                release.release(param);
                conti = null;
            }
            yes = null;
        }
        no = function () {
            release.release(param);
            no = null;
        }
        this.displayPrompt();
    }
});