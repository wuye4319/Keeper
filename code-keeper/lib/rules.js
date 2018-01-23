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

let langbox = ['cn/', 'en/']
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
    lang === 'all/' ? lang = langbox : lang = [lang]
    for (let i in lang) {
      mypathlist.push(this.mypath(lang[i]))
    }
  }

  // config
  infor () {
    let data = {
      config: config,
      lang: lang,
      isrouter: isrouter,
      initpath: initpath,
      basepath: basepath,
      myChildDir: myChildDir,
      myModuleDir: myModuleDir,
      mySource: mySource
    }
    return data
  }

  // transfile
  transfile (mainlang) {
    let filelist = require('../config/routerlist.js')
    let transfile = {
      normaljs: './front/' + mainlang + 'source/js/' + myModuleDir + '/' + myChildDir + configtransfile,
      router: './front/' + mainlang + 'source/js/' + myModuleDir + '/' + configtransfile,
      mytrans: false
    }

    // router trans file
    if (lang.indexOf(mainlang) !== -1) {
      transfile.mytrans = {}
      if (isrouter !== -1) {
        // router dir trans file [account.js trans]
        if (fs.existsSync(transfile.router)) {
          let namefs1 = fs.readFileSync(transfile.router).toString()
          Object.assign(transfile.mytrans, JSON.parse(namefs1))
        } else {
          console.log('Warning : trans file of router js is not exist!'.red)
        }
        // each all trans files
        let myaccount = filelist[mainlang.substr(0, mainlang.lastIndexOf('/'))]
        myaccount || console.log('Warning : router cache is empty! please run \'.initrouter\'!'.red)
        for (let d in myaccount) {
          let transfs = './front/' + mainlang + 'source/js/' + myModuleDir + '/' + myaccount[d] + '/' + configtransfile
          if (fs.existsSync(transfs)) {
            let namefs = fs.readFileSync(transfs).toString()
            Object.assign(transfile.mytrans, JSON.parse(namefs))
          } else {
            console.log('Warning : trans file: '.red + transfs.green + ' is not exist!'.red)
          }
        }
      } else {
        if (fs.existsSync(transfile.normaljs)) {
          let namefs2 = fs.readFileSync(transfile.normaljs).toString()
          Object.assign(transfile.mytrans, JSON.parse(namefs2))
        } else {
          console.log('Warning : trans file: '.red + transfile.normaljs.green + ' is not exist!'.red)
        }
      }
    }

    let data = {
      transfile: transfile.mytrans
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
    let init = {
      // routerlist
      routjs: './front/' + base.js + myModule + '.js',
      // init
      myupchildname: myChildName.substr(0, 1).toLocaleUpperCase() + myChildName.substr(1),
      myless: './' + mySource + '.less',
      commonless: myAutoPath + '../../../../plugin/less/class.less',
      myroutjs: '/' + basepath + base.js + myModule,
      wrapjs: '/' + basepath + lang + wrapper,
      myjs: '/' + basepath + base.js + myChildDir + mySource
    }
    let mypath = {}
    Object.assign(mypath, base, init)
    return mypath
  }

  // seo infor
  seoinfor () {
    let seofile = this.options.seofile
    // seo config
    let tempseoconfig = fs.readFileSync(seofile).toString()
    let seoconfig = JSON.parse(tempseoconfig)

    let myseoinfor
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

  dev (ispub) {
    let arrwebpack = []
    let develop
    let myseoinfor = this.seoinfor()

    // dev and pub
    for (let i in lang) {
      let singleinfor = (lang[i] === 'cn/' ? myseoinfor[0] : myseoinfor[1])
      let tempobj = {
        template: initpath.htmlpath,
        data: {
          title: singleinfor.title,
          keywords: singleinfor.keyword,
          description: singleinfor.description,
          container: '<div id="container"><div style="position:fixed;top:0;right:0;bottom:0;left:0;background:url(\'/cn/source/img/orion/loading_normal_62.gif\') no-repeat center;"></div><div class="static" style="opacity: 0;"><%= container %></div></div>',
          loadjs: '/' + basepath + 'plugin/' + (ispub ? 'base' : 'dev') + '/load.js',
          wrapjs: mypathlist[i].wrapjs
        }
      }
      if (isrouter !== -1) {
        // router dir
        tempobj.filename = '/' + basepath + mypathlist[i].html + 'index.html'
        tempobj.data.myjs = mypathlist[i].myroutjs + (ispub ? '.min.js' : '.js')
        arrwebpack.push(tempobj)
        develop = myModuleDir + '/' + myModule
      } else {
        // normal dir
        tempobj.filename = '/' + basepath + mypathlist[i].html + myChildDir + 'index.html'
        tempobj.data.myjs = mypathlist[i].myjs + (ispub ? '.min.js' : '.js')
        arrwebpack.push(tempobj)
        develop = myModuleDir + '/' + myChildDir + mySource
      }
    }
    let data = {
      webdev: arrwebpack,
      develop: develop
    }
    return data
  }
}

module.exports = rules
