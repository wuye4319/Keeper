/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
let fs = require('fs')
const path = require('path')
let mypathlist = []
let myModule, myModuleDir, childModule, routerdir
let proxy, wrapper, configtransfile, lang, basepath, isrouter
let htmlbasepath, myChildDir, myChildName, mySource, myAutoPath

let config
let systemconfig = require('../config/system')

let initpath = {
  imgpath: systemconfig.base + '/source/img/.gitkeep',
  htmlpath: systemconfig.base + '/page/init.html',
  jspath: systemconfig.base + '/source/js/init.js',
  lesspath: systemconfig.base + '/source/less/init.less',
  rout: systemconfig.base + '/source/js/init-rout.txt',
  routjs: systemconfig.base + '/source/js/router.txt'
}

// construct
class rules {
  constructor () {
    // init
    this.options = {
      seofile: './seoinfor.json'
    }

    this.loadconfig()
  }

  loadconfig () {
    config = eval(fs.readFileSync('./config.js').toString())

    myModule = config.myModule
    myModuleDir = config.myModule.toLocaleLowerCase()
    childModule = config.childModule
    routerdir = config.routerdir
    proxy = config.proxy
    wrapper = config.wrapper
    configtransfile = config.transfile
    lang = (config.lang ? config.lang + '/' : '')
    basepath = (config.basepath ? config.basepath + '/' : '')
    isrouter = routerdir.indexOf(myModuleDir)
    htmlbasepath = (config.htmlbasepath ? config.htmlbasepath + '/' : '')
    myChildDir = (childModule ? childModule.toLocaleLowerCase() + '/' : '')
    myChildName = childModule.substr(childModule.lastIndexOf('/') + 1)
    mySource = (myChildName || myModule)
    myAutoPath = (childModule ? '../' : '')

    let childnum = childModule.split('/').length - 1
    for (let i = 0; i < childnum; i++) {
      myAutoPath += '../'
    }

    // language
    lang === 'all/' ? lang = ['cn/', 'en/'] : lang = [lang]
    for (let i in lang) {
      mypathlist.push(this.mypath(lang[i]))
    }
  }

  // config
  infor () {
    let data = {
      config: config,
      mypathlist: mypathlist,
      lang: lang,
      isrouter: isrouter,
      initpath: initpath,
      basepath: basepath,
      myChildDir: myChildDir
    }
    return data
  }

  // transfile
  transfile () {
    let filelist = require('../config/routerlist.js')
    let transfile = {
      fs: './front/en/source/js/' + myModuleDir + '/' + myChildDir + configtransfile,
      mytrans: false
    }

    // router trans file
    if (lang.indexOf('en/') !== -1) {
      transfile.mytrans = {}
      if (isrouter !== -1) {
        // router dir trans file [account.js trans]
        var initfs = './front/en/source/js/' + myModuleDir + '/' + configtransfile
        if (fs.existsSync(initfs)) {
          var namefs1 = fs.readFileSync(initfs).toString()
          Object.assign(transfile.mytrans, JSON.parse(namefs1))
        } else {
          console.log('Warning : trans file of router js is not exist!'.red)
        }
        // each all trans files
        var myaccount = filelist.en
        myaccount.length || console.log('Warning : router cache is empty! please run \'.initrouter\'!'.red)
        for (var d = 0; d < myaccount.length; d++) {
          var transfs = './front/en/source/js/' + myModuleDir + '/' + myaccount[d] + '/' + configtransfile
          if (fs.existsSync(transfs)) {
            var namefs = fs.readFileSync(transfs).toString()
            Object.assign(transfile.mytrans, JSON.parse(namefs))
          } else {
            console.log('Warning : trans file: '.red + transfs.green + ' is not exist!'.red)
          }
        }
      } else {
        if (fs.existsSync(transfile.fs)) {
          var namefs2 = fs.readFileSync(transfile.fs).toString()
          Object.assign(transfile.mytrans, JSON.parse(namefs2))
        } else {
          console.log('Warning : trans file: '.red + transfile.fs.green + ' is not exist!'.red)
        }
      }
    }

    var data = {
      transfile: transfile
    }
    return data
  }

  // my path
  mypath (lang) {
    let base = {
      stat: './static/' + basepath,
      html: lang + htmlbasepath + myModuleDir + '/',
      js: lang + 'source/js/' + myModuleDir + '/',
      img: lang + 'source/img/' + myModuleDir + '/',
      less: lang + 'source/less/' + myModuleDir + '/'
    }
    let clearpath = {
      // clear
      statimg: base.stat + base.img + myChildDir + '.gitkeep',
      stathtml: base.stat + base.html + myChildDir + 'index.html',
      frtjs: './front/' + base.js + myChildDir + mySource + '.js',
      frtless: './front/' + base.less + myChildDir + mySource + '.less',
      statjs: base.stat + base.js + myChildDir + mySource + '.js',
      statpart: base.stat + base.js + myChildDir + mySource + '.part.js'
    }
    let init = {
      // routerlist
      namefile: './front/' + (lang ? 'cn/' : '') + 'source/js/' + myModuleDir + '/routername.js',
      routjs: './front/' + base.js + myModule + '.js',
      link: '/' + basepath + base.html,
      file: '/' + basepath + base.js,
      // init
      myupchildname: myChildName.substr(0, 1).toLocaleUpperCase() + myChildName.substr(1),
      myless: myAutoPath + '../../less/' + myModuleDir + '/' + myChildDir + mySource + '.less',
      commonless: myAutoPath + '../../../plugin/less/class.less',
      myroutjs: '/' + basepath + base.js + myModule + '.js',
      loadjs: '/' + basepath + 'plugin/base/load.js',
      wrapjs: '/' + basepath + lang + wrapper,
      myjs: '/' + basepath + base.js + myChildDir + mySource + '.js'
    }
    let mypath = {}
    Object.assign(mypath, base, clearpath, init)
    return mypath
  }

  // seo infor
  seoinfor () {
    var seofile = this.options.seofile
    // seo config
    var seoconfig = fs.readFileSync(seofile).toString()
    seoconfig = JSON.parse(seoconfig)

    var myseoinfor
    if (myChildDir) {
      if (!eval('seoconfig.' + myModuleDir)) {
        myseoinfor = eval('seoconfig.default.default')
      } else {
        myseoinfor = eval('seoconfig.' + myModuleDir + '[\'' + childModule + '\']') || eval('seoconfig.default.default')
      }
    } else if (myModuleDir) {
      myseoinfor = (eval('seoconfig.' + myModuleDir) ? (eval('seoconfig.' + myModuleDir + '.construct') || eval('seoconfig.default.construct')) : false) || eval('seoconfig.default.construct')
    }
    return myseoinfor
  }

  dev () {
    let arrwebpack = []
    let develop
    let myseoinfor = this.seoinfor()

    // dev and pub
    for (let i = 0; i < lang.length; i++) {
      let singleinfor = (lang[i] === 'cn/' ? myseoinfor[0] : myseoinfor[1])
      let tempobj = {
        template: initpath.htmlpath,
        data: {
          title: singleinfor.title,
          keywords: singleinfor.keyword,
          description: singleinfor.description,
          container: '<div id="container"><div style="position:fixed;top:0;right:0;bottom:0;left:0;background:url(\'/cn/source/img/orion/loading_normal_62.gif\') no-repeat center;"></div><div class="static" style="opacity: 0;"><%= container %></div></div>',
          loadjs: mypathlist[i].loadjs,
          wrapjs: mypathlist[i].wrapjs
        }
      }
      if (isrouter !== -1) {
        // router dir
        tempobj.filename = '/' + basepath + mypathlist[i].html + 'index.html'
        tempobj.data.myjs = mypathlist[i].myroutjs
        arrwebpack.push(tempobj)
        develop = myModuleDir + '/' + myModule
      } else {
        // normal dir
        tempobj.filename = '/' + basepath + mypathlist[i].html + myChildDir + 'index.html'
        tempobj.data.myjs = mypathlist[i].myjs
        arrwebpack.push(tempobj)
        develop = myModuleDir + '/' + myChildDir + mySource
      }
    }
    var data = {
      webdev: arrwebpack,
      develop: develop
    }
    return data
  }
}

module.exports = rules
