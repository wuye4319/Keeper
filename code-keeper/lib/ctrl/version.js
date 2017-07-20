/**
 * Created by nero on 2017/3/23.
 */
var fsvers = require("../rules/version");
var rulvers = new fsvers();

function myvers() {

}

//version of rules.js, not config.js
myvers.prototype.vers = function () {
    var version = rulvers.version().version;
    console.log('version:'.green + version.green);
}

myvers.prototype.checkconf = function () {
    var result = rulvers.checkconf();
    return result;
}

module.exports = myvers;