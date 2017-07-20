/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
var mypathlist = [];
var myModule, myModuleDir, childModule, routerdir, proxy, wrapper, configtransfile, lang, basepath, isrouter, htmlbasepath, myChildDir, myChildName, mySource, myAutoPath;

var file = "./config.js";
var configstr = fs.readFileSync(file).toString();
var config = eval(configstr);

var initpath = {
    imgpath: './front/plugin/init/source/img/.gitkeep',
    htmlpath: './front/plugin/init/page/init.html',
    jspath: './front/plugin/init/source/js/init.js',
    lesspath: './front/plugin/init/source/less/init.less',
    rout: './front/plugin/init/source/js/init-rout.txt',
    routjs: './front/plugin/init/source/js/router.txt'
}

//construct
class rules {
    constructor() {
        //init
        this.options = {
            seofile: "./seoinfor.json",
            config: config
        };

        myModule = config.myModule,
            myModuleDir = config.myModule.toLocaleLowerCase(),
            childModule = config.childModule,
            routerdir = config.routerdir,
            proxy = config.proxy,
            wrapper = config.wrapper,
            configtransfile = config.transfile,
            lang = (config.lang ? config.lang + "/" : ""),
            basepath = (config.basepath ? config.basepath + "/" : ""),
            isrouter = routerdir.indexOf(myModuleDir),
            htmlbasepath = (config.htmlbasepath ? config.htmlbasepath + "/" : ""),
            myChildDir = (childModule ? childModule.toLocaleLowerCase() + "/" : ""),
            myChildName = childModule.substr(childModule.lastIndexOf("/") + 1),
            mySource = (myChildName || myModule),
            myAutoPath = (childModule ? '../' : '');

        var childnum = childModule.split("/").length - 1;
        for (var i = 0; i < childnum; i++) {
            myAutoPath += "../";
        }

        //language
        lang == "all/" ? lang = ["cn/", "en/"] : lang = [lang];

        this.mypath();
    }

    //config
    infor() {
        var config = this.options.config;
        var data = {
            config: config,
            mypathlist: mypathlist,
            lang: lang,
            isrouter: isrouter,
            initpath: initpath
        };
        return data;
    }

    //transfile
    transfile() {
        var filelist = require('../config/routerlist.js');
        var transfile = {
            fs: "./front/en/source/js/" + myModuleDir + "/" + myChildDir + configtransfile,
            mytrans: false
        };

        //router trans file
        if (lang.indexOf("en/") != -1) {
            transfile.mytrans = {};
            if (isrouter != -1) {
                //router dir trans file [account.js trans]
                var initfs = "./front/en/source/js/" + myModuleDir + "/" + configtransfile;
                if (fs.existsSync(initfs)) {
                    var namefs1 = fs.readFileSync(initfs).toString();
                    Object.assign(transfile.mytrans, JSON.parse(namefs1));
                } else {
                    console.log("warning : trans file of router js is not exist!".red);
                }
                //each all trans files
                var myaccount = filelist.en;
                for (var d = 0; d < myaccount.length; d++) {
                    var transfs = "./front/en/source/js/" + myModuleDir + "/" + myaccount[d] + "/" + configtransfile;
                    if (fs.existsSync(transfs)) {
                        var namefs = fs.readFileSync(transfs).toString();
                        Object.assign(transfile.mytrans, JSON.parse(namefs));
                    } else {
                        console.log("warning : trans file: ".red + transfs.green + " is not exist!".red);
                    }
                }
            } else {
                if (fs.existsSync(transfile.fs)) {
                    var namefs2 = fs.readFileSync(transfile.fs).toString();
                    Object.assign(transfile.mytrans, JSON.parse(namefs2));
                } else {
                    console.log("warning : trans file: ".red + transfile.fs.green + " is not exist!".red);
                }
            }
        }

        var data = {
            transfile: transfile,
        };
        return data;
    }

    //my path
    mypath() {
        for (var i = 0; i < lang.length; i++) {
            var child = {
                html: lang[i] + htmlbasepath + myModuleDir + '/',
                js: lang[i] + 'source/js/' + myModuleDir + '/',
                img: lang[i] + 'source/img/' + myModuleDir + '/',
                less: lang[i] + 'source/less/' + myModuleDir + '/',
            }
            var base = {
                //base
                stat: './static/' + basepath,
                chtml: child.html + myChildDir,
                cjs: child.js + myChildDir,
                cimg: child.img + myChildDir,
                cless: child.less + myChildDir,
            };
            var clearpath = {
                //clear
                statimg: base.stat + base.cimg + ".gitkeep",
                stathtml: base.stat + base.chtml + 'index.html',
                frtjs: './front/' + base.cjs + mySource + '.js',
                frtless: './front/' + base.cless + mySource + '.less',
                statjs: base.stat + base.cjs + mySource + '.js',
                statpart: base.stat + base.cjs + mySource + '.part.js',
            }
            var init = {
                //routerlist
                namefile: "./front/" + (lang[i] ? "cn/" : "") + "source/js/" + myModuleDir + "/routername.js",
                routjs: './front/' + child.js + myModule + '.js',
                //link: "/" + basepath + base.chtml,
                link: "/" + basepath + child.html,
                file: "/" + basepath + child.js,
                //init
                myupchildname: myChildName.substr(0, 1).toLocaleUpperCase() + myChildName.substr(1),
                myless: myAutoPath + '../../less/' + myModuleDir + '/' + myChildDir + mySource + '.less',
                commonless: myAutoPath + '../../../plugin/less/class.less',
                myroutjs: "/" + basepath + child.js + myModule + '.js',
                loadjs: "/" + basepath + 'plugin/base/load.js',
                wrapjs: "/" + basepath + lang[i] + wrapper,
                //wrapjs: "<script src=\"/" + basepath + lang[i] + "react-plugin/Wrap.min.js\"></script>",
                myjs: "/" + basepath + base.cjs + mySource + '.js'
            }
            var mypath = {};
            Object.assign(mypath, child, base, clearpath, init);
            mypathlist.push(mypath);
        }
    }

    //seo infor
    seoinfor() {
        var seofile = this.options.seofile;
        //seo config
        var seoconfig = fs.readFileSync(seofile).toString();
        seoconfig = JSON.parse(seoconfig);

        var myseoinfor;
        if (!!myChildDir) {
            if (!eval("seoconfig." + myModuleDir)) {
                myseoinfor = eval("seoconfig.default.default");
            } else {
                myseoinfor = eval("seoconfig." + myModuleDir + "['" + childModule + "']") || eval("seoconfig.default.default");
            }
        } else if (!!myModuleDir) {
            myseoinfor = (eval("seoconfig." + myModuleDir) ? (eval("seoconfig." + myModuleDir + ".construct") || eval("seoconfig.default.construct")) : false) || eval("seoconfig.default.construct");
        }
        return myseoinfor;
    }

    dev() {
        var arrwebpack = [], develop, myseoinfor = this.seoinfor();

        //dev and pub
        for (var i = 0; i < lang.length; i++) {
            var singleinfor = (lang[i] == "cn/" ? myseoinfor[0] : myseoinfor[1]);
            if (isrouter != -1) {
                //router dir
                arrwebpack.push({
                    filename: "/" + basepath + mypathlist[i].html + 'index.html',
                    template: initpath.htmlpath,
                    data: {
                        title: singleinfor.title,
                        keywords: singleinfor.keyword,
                        description: singleinfor.description,
                        container: "<div id=\"container\" style=\"opacity: 0;\"><%= container %></div>",
                        myjs: mypathlist[i].myroutjs,
                        loadjs: mypathlist[i].loadjs,
                        wrapjs: mypathlist[i].wrapjs
                    }
                });
                develop = myModuleDir + '/' + myModule;
            } else {
                //normal dir
                arrwebpack.push({
                    filename: "/" + basepath + mypathlist[i].chtml + 'index.html',
                    template: initpath.htmlpath,
                    data: {
                        title: singleinfor.title,
                        keywords: singleinfor.keyword,
                        description: singleinfor.description,
                        container: "<div id=\"container\" style=\"opacity: 0;\"><%= container %></div>",
                        myjs: mypathlist[i].myjs,
                        loadjs: mypathlist[i].loadjs,
                        wrapjs: mypathlist[i].wrapjs
                    }
                });
                develop = myModuleDir + '/' + myChildDir + mySource;
            }
        }
        var data = {
            webdev: arrwebpack,
            develop: develop,
        }
        return data;
    }
}

module.exports = rules;