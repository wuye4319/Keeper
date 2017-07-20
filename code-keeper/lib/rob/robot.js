/**
 * author:nero
 * version:v1.0
 * robot will help me to control all things
 */
;'use strict';
var fs = require('fs');
//async
var async = require("async");
var datalist = [], listindex = 0;
var fsstatic = require('../ctrl/static');
var static = new fsstatic();

//constructor
function Robot() {
    // Default options
    this.options = {};
}

//launcher
Robot.prototype.robot = function (sitepage, Prompt) {
    console.log("robot is running!".green);
    var self = this;
    async.waterfall([
        this.proxy,
        this.delay,
    ], function (err, result) {
        if (result) {
            console.log("finished!");
        }
    });
}
Robot.prototype.newconf = function (callback) {

}
Robot.prototype.proxy = function (callback) {
    var file = __dirname + "/../rules.js";
    var configstr = fs.readFileSync(file).toString();
    var temprules = eval(configstr);
    var rules = new temprules("rob");
    rules.infor();

    console.log("proxy".blue + listindex);
    static.static();
    callback(null, 3, "");
    listindex++;
}

Robot.prototype.delay = function (second, data, callback) {
    //pass last delay
    var islast = (listindex == datalist.length);
    var count = islast ? 0 : second;
    async.during(
        function (callback) {
            return callback(null, count >= 0);
        },
        function (callback) {
            islast || console.log(count);
            count--;
            setTimeout(callback, 1000);
        },
        function (err) {
            console.log("rest is over!".green);
            callback(null, "true", data);
        }
    );
}

module.exports = Robot;