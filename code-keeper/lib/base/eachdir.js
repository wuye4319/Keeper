/**
 * Created by nero on 2017/4/5.
 * each dir
 */
var writefile = require("./writefile");
writefile = new writefile();

var routerlist = {"cn": [], "en": []};
class eachdir {
    //seach all dir under router dir
    seachdir(myfilepath, prepath, lang, type) {
        var myconfig = myinfor.config;
        var that = this;
        var source = myconfig.sourcedir;
        var paths = fs.readdirSync(myfilepath);
        !paths || paths.forEach(function (path, index) {
            var _myfilepath = myfilepath + path;
            var file = fs.statSync(_myfilepath);
            if (file.isDirectory()) {
                var isSource = source.indexOf(path);
                if (isSource == -1) {
                    //same name js file is exist in the dir
                    var isndir = (type == "html" ? fs.existsSync(_myfilepath + "/index.html") : fs.existsSync(_myfilepath + "/" + path + ".js"));
                    path = (prepath ? prepath + path : path);
                    //out path
                    if (isndir) {
                        lang == "en/" ? routerlist.en.push(path) : routerlist.cn.push(path);
                    }
                    that.seachdir(_myfilepath + "/", path + "/", lang);
                }
            }
        })
    }

    seachdirbykey(key) {
        routerlist = {"cn": [], "en": []};
        var myconfig = myinfor.config;
        var lang = myinfor.lang;
        for (var i = 0; i < lang.length; i++) {
            //each dir name from [router dir]
            if (key == "js") {
                this.seachdir("./front/" + lang[i] + "source/js/" + myconfig.myModule + "/", "", lang[i]);
            } else {
                this.seachdir("./front/" + lang[i] + "source/js/" + myconfig.myModule + "/", "", lang[i], "html");
            }
        }

        //update router list
        //use for .dev[transfile], read en dir, and contant trans.
        var file = __dirname + "/../../tpl/routerlist.txt";
        var outfile = __dirname + "/../../config/routerlist.js";
        var tpl = fs.readFileSync(file).toString();
        var data = {routerlist_cn: JSON.stringify(routerlist.cn), routerlist_en: JSON.stringify(routerlist.en)};
        var str = render.renderdata(tpl, data);
        //write my file And Report
        var newfile = writefile.writejs(outfile, str);
        newfile ? console.log("router list is update!".green) : console.log("router list is update failed!".red);

        return routerlist;
    }
}

module.exports = eachdir;