/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict';
var fs = require('fs');
const vm = require('vm');
var cheerio = require('cheerio');
var request = require('request');
var render = require('./render');
render = new render();
var writefile = require('./writefile');
writefile = new writefile();

//constructor
function InitJs() {
    // Default options
    this.options = {};
}

//init the plugin 'phantom'
InitJs.prototype.staticpage=function (file,url,Prompt) {
    var t = Date.now();

    request("http://buy.superbuy.com/plugin/base/react-with-addons.min.js", function (error, response, body) {
        if(error){ console.log('FAIL to load the address'.red, error); }
        else{
            var result=vm.runInThisContext(body);
            console.log(result);
            //this.writefile(file,body);
            //this.endstat(Prompt);
        }
    });

}

InitJs.prototype.writefile=function (file,body,Prompt) {
    var $=cheerio.load(body);
    var html=$("#container").html();
    //write file
    var tpl = fs.readFileSync(file).toString();
    var data={container:html};
    var str= render.renderdata(tpl,data);
    var newfile=writefile.writejs(file,str);
    newfile?console.log(file.yellow+" is init sucessed!".blue):console.log(file.yellow+" is init failed!".red);
    console.log(file.yellow+" was overwrite!".cyan);
}

InitJs.prototype.endstat=function (Prompt) {
    //count time
    t = Date.now() - t;
    console.log('Loading time '.green + (t/1000).toString().red + ' second'.green);
    !Prompt || Prompt.displayPrompt();
}

module.exports = InitJs;