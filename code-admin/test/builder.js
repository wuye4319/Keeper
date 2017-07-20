const r = require('repl');
var fs = require("fs");
var colors = require("../colors");
var mysql=require("../lib/ctrl/mysql");
var basesql=require('../lib/base/mysql');
var reflux=require('../lib/base/myreflux');
var writefile = require('../lib/base/writefile');
writefile = new writefile();
repls = r.start({prompt: '> ', eval: myEval});
const spawn = require('child_process').spawn;

var command={select:"",edit:"",del:""},paramarray=[],currfunc=null,indparam;
//listener
function myEval(cmd, context, filename, callback) {
    var param=cmd.trim().split(" ");
    indparam=isparam(paramarray,param[0]);
    if(cmd.trim() == ""){
    } else if(indparam!=-1){
        reflux.trigger("array");
    } else if(param[0]=="1"){
        reflux.trigger("on",param[1]);
    } else if(param[0]=="2"){
        reflux.trigger("tw",param[1]);
    }else{
        keyerr();
    }
    this.displayPrompt();
}
function isparam(arr,par) {
    var result=-1;
    for(var i in arr){
        if(Object.keys(arr[i])[0]==par){
            result=i;
        }
    }
    return result;
}
function keyerr() {
    console.log("Invalid keyword!!!".red);
}

repls.defineCommand("select", {
    help: 'connect to mysql'.green,
    action: function (param) {
        console.log("请输入序号来选择。[id]".green);
        console.log("1.product list");
        console.log("2.theme list");
        reflux.on("on",function () {
            command.select="mysql.getkind()";
            paramarray=[{"1":3},{"2":4}];
            mysql.getkind();
            reflux.off("on");
            reflux.on("array",function (page) {
                var theme=Object.values(paramarray[indparam])[0];
                if(page){
                    mysql.getprolist(theme,page-1);
                }else{
                    console.log("当前为第一页".green);
                    mysql.getprolist(theme,0);
                }
                command.predit="mysql.getprobyid(1)";
                command.edit="mysql.editpro()";
            })
        })
        reflux.one("tw",function () {
            mysql.getkind();
            reflux.one("on",function () {
                if(page){
                    mysql.getthemelist(101,page-1);
                }else{
                    console.log("当前为第一页".green);
                    mysql.getthemelist(101,0);
                }
            })
        })
        this.displayPrompt();
    }
})
repls.defineCommand("cmd", {
    help: 'connect to mysql'.green,
    action: function (param) {
        eval(command.select);
        this.displayPrompt();
    }
})
repls.defineCommand("add", {
    help: 'connect to mysql'.green,
    action: function (param) {
        robot.mysql();
        this.displayPrompt();
    }
})
repls.defineCommand('edit', {
    help: 'a robot to do sth for you'.green,
    action: function (param) {
        var predit=command.predit;
        if(predit){
            var str=eval(command.predit);
        }else{
            console.log("command is error!".red);
        }
        //write file
        var file= __dirname+"/temp/temp.json";
        var newfile = writefile.writejs(file, str);
        newfile || console.log(file.yellow + " is init failed!".red);
        const ls = spawn('notepad.exe', [__dirname+'/temp/temp.json']);
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            var cedit=command.edit;
            if(cedit){
                //eval(command.edit);
            }else{
                console.log("command is error!".red);
            }
        });
        this.displayPrompt();
    }
});
repls.defineCommand('del', {
    help: 'a robot to do sth for you'.green,
    action: function (param) {
        eval(command.del);
        this.displayPrompt();
    }
});
repls.defineCommand('.e', {
    help: 'end mysql'.red,
    action: function () {
        console.log('mysql is cloes'.red);
        basesql.endconn()
    }
});
repls.defineCommand('.', {
    help: 'end and exit'.red,
    action: function () {
        basesql.endconn();
        console.log('Thanks for using! Bye~~~'.rainbow);
        this.close();
    }
});