/**
 * Created by nero on 2017/3/23.
 * rule of version
 */
var fsrules = require('../rules');
var rules = new fsrules();
var myinfor = rules.infor();

class vers {
    constructor() {
        this.options = {
            version: "1.1.1"
        }
    }

    //version
    version() {
        var data = {
            version: this.options.version
        }
        return data;
    }

    checkconf() {
        var versconf = myinfor.config.version;
        var configcheck = [
            {name: "basepath", value: myinfor.config.basepath},
            {name: "htmlbasepath", value: myinfor.config.htmlbasepath},
            {name: "lang", value: myinfor.lang},
            {name: "wrapper", value: myinfor.config.wrapper.substr(0, myinfor.config.wrapper.lastIndexOf("/"))}
        ]
        var result = true;
        if (versconf != this.options.version) {
            console.log("!!! Warnning : Your config.js is not the latest version, Please create a new config.js buy '.initconf',".red);
            result = false;
        }
        if (myinfor.config.transfile.trim() == "") {
            console.log("Warning : transfile can't be empty!".red);//transfile
        }
        for (var i in configcheck) {
            if (configcheck[i].value) {
                var dirpath = "./static/" + myinfor.lang[0] + (configcheck[i].name == "lang" ? "" : configcheck[i].value + "/");
                var isexist = fs.existsSync(dirpath);
                isexist || console.log("Warning : ".yellow + configcheck[i].name.green + " is non-existing dir! Please comfirm.".yellow);
            }
        }
        return result;
    }
}

module.exports = vers;