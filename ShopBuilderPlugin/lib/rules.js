/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
let fs = require('fs')
const path = require('path')
let myModule, myModuleDir, childModule
// let proxy, routerdir, isrouter
let wrapper, configtransfile, lang, basepath
let htmlbasepath, myChildDir, myChildName, mySource, myAutoPath
let autohtmlbasepath

let config
let sysconf = require('../config/system')

let initpath = {
  htmlpath: './front/plugin/init/page/init.html'
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

  loadconfig (url) {
    let confjs = path.join(__dirname, '/../config/config.js')
    config = eval(fs.readFileSync(confjs).toString())
    if (url) {
      url = url.split('/')
      myModule = url[0]
      myModuleDir = myModule.toLocaleLowerCase()
      childModule = url[1] || ''
    } else {
      myModule = config.myModule
      myModuleDir = myModule.toLocaleLowerCase()
      childModule = config.childModule
    }

    // routerdir = config.routerdir
    // proxy = config.proxy
    wrapper = config.wrapper
    configtransfile = config.transfile
    lang = (config.lang ? config.lang + '/' : '')
    basepath = (config.basepath ? config.basepath + '/' : '')
    // isrouter = routerdir.indexOf(myModuleDir)
    htmlbasepath = (config.htmlbasepath ? config.htmlbasepath + '/' : '')
    myChildDir = (childModule ? childModule.toLocaleLowerCase() + '/' : '')
    myChildName = childModule.substr(childModule.lastIndexOf('/') + 1)
    mySource = (myChildName || myModule)
    myAutoPath = (childModule ? '../' : '')
    autohtmlbasepath = htmlbasepath ? '../' : ''

    let childnum = childModule.split('/').length - 1
    for (let i = 0; i < childnum; i++) {
      myAutoPath += '../'
    }

    // language
    lang === 'all/' ? lang = ['cn/', 'en/'] : lang = [lang]
  }

  // config
  infor () {
    let data = {
      config: config,
      lang: lang,
      // isrouter: isrouter,
      initpath: initpath,
      basepath: basepath,
      myChildDir: myChildDir,
      myModuleDir: myModuleDir,
      mySource: mySource
    }
    // this.mypath('cn/')
    return data
  }

  // transfile
  transfile (mainlang) {
    let transfile = {
      normaljs: './front/' + mainlang + 'source/js/' + myModuleDir + '/' + myChildDir + configtransfile,
      router: './front/' + mainlang + 'source/js/' + myModuleDir + '/' + configtransfile,
      mytrans: false
    }

    // router trans file
    if (mainlang && lang.indexOf(mainlang) !== -1) {
      transfile.mytrans = {}

      if (fs.existsSync(transfile.normaljs)) {
        let namefs2 = fs.readFileSync(transfile.normaljs).toString()
        Object.assign(transfile.mytrans, JSON.parse(namefs2))
      } else {
        console.log('Warning : trans file: '.red + transfile.normaljs.green + ' is not exist!'.red)
      }
    }

    let data = {
      transfile: transfile.mytrans
    }
    return data
  }

  // my path
  mypath (lang, user) {
    if (!user) user = 'testuser'
    let themeconf = sysconf.root + user + '/themeconf.js'
    let theme
    if (fs.existsSync(themeconf)) {
      theme = eval(fs.readFileSync(themeconf).toString())
    } else {
      console.log('theme config error!'.red)
    }

    let base = {
      html: lang + htmlbasepath + myModuleDir + '/',
      js: lang + 'source/js/' + myModuleDir + '/',
      usertheme: user + '/' + theme.currtheme + '/',
      theme: theme.currtheme
    }
    let init = {
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
      myseoinfor = (eval('seoconfig.' + myModuleDir)
        ? (eval('seoconfig.' + myModuleDir + '.construct') || eval('seoconfig.default.construct'))
        : false) || eval('seoconfig.default.construct')
    }
    return myseoinfor
  }

  dev (ispub, lang, user) {
    let myseoinfor = this.seoinfor()
    let mypathlist = this.mypath(lang, user)

    // dev and pub
    let singleinfor = (lang === 'cn/' ? myseoinfor[0] : myseoinfor[1])
    let tempobj = {
      template: initpath.htmlpath,
      data: {
        title: singleinfor.title,
        keywords: singleinfor.keyword,
        description: singleinfor.description,
        container: '<div id="container"><div style="position:fixed;top:0;right:0;bottom:0;left:0;background:url(\'/cn/source/img/orion/loading_normal_62.gif\') no-repeat center;"></div><div class="static" style="opacity: 0;"><%= container %></div></div>',
        loadjs: '/' + basepath + 'plugin/' + (ispub ? 'base' : 'dev') + '/load.js',
        wrapjs: mypathlist.wrapjs
      }
    }
    // normal dir
    let develop = 'source/' + myModuleDir + '/' + myChildDir + mySource
    tempobj.filename = '/' + basepath + mypathlist.html + myChildDir + 'index.html'
    tempobj.data.myjs = mypathlist.myjs + (ispub ? '.min.js' : '.js')
    let data = {
      webdev: tempobj,
      input: sysconf.root + mypathlist.usertheme + sysconf.frontdir + develop + '.js',
      output: sysconf.root + mypathlist.usertheme + sysconf.staticdir + basepath + develop
    }
    return data
  }

  wrap (lang, user) {
    let mypathlist = this.mypath(lang, user)
    let data = {}
    let wranojs = wrapper.substr(0, wrapper.indexOf('.js'))
    data.input = sysconf.root + mypathlist.usertheme + sysconf.frontdir + lang + wrapper
    data.output = sysconf.root + mypathlist.usertheme + sysconf.staticdir + lang + wranojs

    return data
  }

  createshop (lang, user) {
    let mypathlist = this.mypath(lang, user)
    let data = {}
    // data.fromstatic = './' + theme + '/' + sysconf.staticdir + sysconf.source
    // data.tostatic = sysconf.root + mypathlist.usertheme + '/' + sysconf.staticdir + lang + sysconf.source
    // data.fromfront = './' + theme + '/' + sysconf.frontdir + sysconf.source
    // data.tofront = sysconf.root + mypathlist.user + '/' + sysconf.frontdir + lang + sysconf.source

    // let from = './front/theme/source/tpl/config.json'
    // let to = './shop/testuser/theme/config.json'
    data.fromconfig = './' + sysconf.frontdir + mypathlist.theme + sysconf.source + 'tpl/.config.json'
    data.toconfig = sysconf.root + mypathlist.usertheme + 'config.json'
    return data
  }
}

module.exports = rules
