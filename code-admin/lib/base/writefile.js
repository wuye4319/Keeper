/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict';
//var vm = require('vm');
var fs = require('fs');
const path = require('path');
var fsarrdir = require('./arrdir');
var arrdir = new fsarrdir();

class Writefile {
    constructor() {
        // Default options
        this.options = {
            newfile: false,
        };
    }

    writejs(file, content) {
        var index = file.lastIndexOf("/");
        var dir = file.substr(0, index + 1);
        if (dir.indexOf("\\") != -1) {
            dir = path.normalize(dir);
            dir = dir.replace(/\\/g, "/");
        }
        //creat dir first
        this.mymkdirs(dir);
        //write file
        fs.writeFileSync(file, content);
        this.options.newfile = true;
        //return
        return this.options.newfile;
    }

    mymkdirs(dir) {
        var mydir = arrdir.arrdir(dir).reverse();
        //create dir
        for (var i in mydir) {
            var dir = mydir[i];
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, function (err) {
                });
            }
        }
    }
}

module.exports = Writefile;