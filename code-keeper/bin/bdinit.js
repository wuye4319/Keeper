/**
 * Created by nero on 2017/3/23.
 */
var myctrlinit = require('../lib/ctrl/init');
myctrlinit = new myctrlinit();

var fsclear = require('../lib/ctrl/clear');
clear = new fsclear();//the bin/bdrelease.js used;

var fsstatic = require('../lib/ctrl/static');
var static = new fsstatic();

var fsconf = require('../lib/ctrl/readconf');
var conf = new fsconf();

repls.defineCommand('conf', {
    help: 'setting config of config.js'.green,
    action: function (param) {
        conf.conf(param);
        this.displayPrompt();
    }
});

repls.defineCommand('static', {
    help: 'static your html'.yellow,
    action: function (param) {
        static.static(this, param);
    }
})

repls.defineCommand('clear', {
    help: 'clear your object by config.json'.yellow,
    action: function (param) {
        clear.clear(param);
        this.displayPrompt();
    }
})

repls.defineCommand('init', {
    help: 'init your page'.yellow,
    action: function () {
        myctrlinit.init();
        this.displayPrompt();
    }
})

repls.defineCommand('initconf', {
    help: 'init your config.js'.yellow,
    action: function (type) {
        myctrlinit.initconf(type);
        this.displayPrompt();
    }
})

//create sth by moduel file
repls.defineCommand('createobject', {
    help: 'init your config.js'.yellow,
    action: function (type) {
        myctrlinit.createobject(type);
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('你认为 Node.js 中文网怎么样？', (answer) => {
            // 对答案进行处理
            console.log(`多谢你的反馈：${answer}`);

            rl.close();
        });
        this.displayPrompt();
    }
})

repls.defineCommand('initrouter', {
    help: 'search dir and rewrite router file and routername'.green,
    action: function (param) {
        myctrlinit.initrout(param);
        this.displayPrompt();
    }
});