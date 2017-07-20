/**
 * Created by nero on 2017/6/2.
 * clone a page
 */
var fs = require('fs');
var proxy = require('../lib/myrob/proxy');
proxy = new proxy();
var writefile = require('../lib/base/writefile');
writefile = new writefile();

router.get("/copypagebyurl",async(ctx,next)=>{
    var url="https://detail.tmall.hk/hk/item.htm?spm=a220m.1000858.1000725.5.iLNIOs&id=550527055712&skuId=3519643607903&user_id=2933844383&cat_id=2&is_b=1&rn=b22220efbc8d6975abaf360f2655309d";
    proxy.initpm(url,function (data) {
        var file= __dirname+"/static/index.html";
        var newfile = writefile.writejs(file, data);
        newfile ? console.log(file.yellow + " is init sucessed!".blue) : console.log(file.yellow + " is init failed!".red);
    });
})