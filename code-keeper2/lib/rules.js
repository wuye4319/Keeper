/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
let fs = require('fs')
const path = require('path')
let mypathlist = []
let myModule, myModuleDir, childModule, routerdir, currtheme
let proxy, wrapper, configtransfile, lang, basepath, isrouter
let htmlbasepath, myChildDir, myChildName, mySource, myAutoPath, initpath

let langbox = ['cn/', 'en/']
let config
let sysconf = require('../config/system')

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

    myModule = config.pagename
    myModuleDir = config.pagename.toLocaleLowerCase()
    currtheme = (config.currTheme ? config.currTheme + '/' : '')
    childModule = config.childModule || ''
    routerdir = config.routerdir
    proxy = config.proxy
    wrapper = config.wrapper || ''
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

    initpath = {
      // ./front/plugin/init/source/js/router.txt
      imgpath: sysconf.root + sysconf.frontdir + currtheme + sysconf.plugin + 'source/img/.gitkeep',
      htmlpath: sysconf.root + sysconf.frontdir + currtheme + sysconf.plugin + 'page/init.html',
      jspath: sysconf.root + sysconf.frontdir + currtheme + sysconf.plugin + sysconf.source + 'init.js',
      lesspath: sysconf.root + sysconf.frontdir + currtheme + sysconf.plugin + 'source/less/init.less',
      rout: sysconf.root + sysconf.frontdir + currtheme + sysconf.plugin + sysconf.source + 'init-rout.txt',
      routjs: sysconf.root + sysconf.frontdir + currtheme + sysconf.plugin + sysconf.source + 'router.txt'
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
      mySource: mySource,
      wrapper: wrapper
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
    if (mainlang && lang.indexOf(mainlang) !== -1) {
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
      stat: sysconf.root + sysconf.staticdir + basepath + currtheme,
      front: sysconf.root + sysconf.frontdir + currtheme,
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
      commonless: myAutoPath + (lang ? '../' : '') + '../../../plugin/less/class.less',
      container: '',
      myroutjs: '/' + basepath + base.js + myModule,
      wrapjs: wrapper ? '/' + basepath + lang + wrapper : false,
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
    let name = seoconfig[myModuleDir]
    let defstr = seoconfig['default']['construct']
    if (myChildDir) {
      myseoinfor = name ? (seoconfig[myModuleDir][childModule] || defstr) : defstr
    } else if (myModuleDir) {
      myseoinfor = name ? (seoconfig[myModuleDir]['construct'] || defstr) : defstr
    }
    return myseoinfor
  }

  dev (ispub, lang) {
    let develop
    let myseoinfor = this.seoinfor()
    let mypathlist = this.mypath(lang)

    // dev and pub
    let singleinfor = (lang === 'cn/' ? myseoinfor[0] : myseoinfor[1])
    let tempobj = {
      template: initpath.htmlpath,
      data: {
        title: singleinfor.title,
        keywords: singleinfor.keyword,
        description: singleinfor.description,
        container: '<div id="container">' + mypathlist.container + '<div class="static" style="opacity: 0;"><%= container %></div></div>',
        loadjs: '/' + basepath + 'plugin/' + (ispub ? 'base' : 'dev') + '/load.js',
        wrapjs: mypathlist.wrapjs
      }
    }
    if (isrouter !== -1) {
      // router dir
      tempobj.filename = '/' + basepath + mypathlist.html + 'index.html'
      tempobj.data.myjs = mypathlist.myroutjs + (ispub ? '.min.js' : '.js')
      develop = sysconf.source + myModuleDir + '/' + myModule
    } else {
      // normal dir
      tempobj.filename = '/' + basepath + currtheme + mypathlist.html + myChildDir + 'index.html'
      tempobj.data.myjs = mypathlist.myjs + (ispub ? '.min.js' : '.js')
      develop = sysconf.source + myModuleDir + '/' + myChildDir + mySource
    }
    let data = {
      webdev: tempobj,
      input: sysconf.root + sysconf.frontdir + currtheme + lang + develop + '.js',
      output: basepath + currtheme + lang + develop
    }
    return data
  }

  wrap (lang) {
    let data = {}
    let wranojs = wrapper.substr(0, wrapper.indexOf('.js'))
    let wrapdir = wrapper.substr(0, wrapper.lastIndexOf('/') + 1)
    data.input = sysconf.root + sysconf.frontdir + currtheme + lang + wrapper
    data.output = basepath + currtheme + lang + wranojs
    data.mypath = sysconf.root + sysconf.frontdir + currtheme + lang + wrapdir + config.transfile
    return data
  }
}

module.exports = rules
