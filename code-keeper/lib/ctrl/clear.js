/**
 * Created by nero on 2017/3/21.
 * clear files
 * * * *
 * if config.js changed, please reload.
 * we execute rules.js only in the reload.
 * require execute only one times.
 */
var myctrlinit = require('./init');
myctrlinit = new myctrlinit();

var del = require('../base/delete');
del = new del();
//clear
var fsdelete = require('../rules/delete');
ruldelete = new fsdelete();
confdel = ruldelete.delete();

function clear() {
}

clear.prototype.clear = function (param) {
    if (param == "r") {
        del.deleteSource('./static/release/', "r");
    } else {
        //write file
        for (var i in confdel) {
            var mydata = confdel[i];
            del.deleteSource(mydata.filename);
        }
    }

    var isrouter = myinfor.isrouter;
    //update router.txt
    isrouter == -1 || myctrlinit.initrout();
}

module.exports = clear;