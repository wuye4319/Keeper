#!/usr/bin/env node
var colors = require("../colors");
fs = require("fs");
var ready = require('./ready');
ready = new ready();

//check program running environment.
var iskeeper = fs.existsSync("./node_modules/code-keeper/bin/main.js");
if (iskeeper) {
    var isready = fs.existsSync("./node_modules/code-keeper/config/sysconf.js");
    if (!isready) {
        ready.boot();
    } else {
        bootstrap();
    }
} else {
    console.log("Keeper is running at wrong Environment!!!".red);
}

function bootstrap() {
    require('./builder');
    require('./bdvers');
    require('./bdrelease');
    require('./bdinit');
    require('./bdrob');
}