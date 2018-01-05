/**
 * author:nero
 * version:v1.1
 * plugin:code-keeper
 */
const fs = require('fs')
const path = require('path')
const Fsrules = require('./ctrl/loadconf')
let rules = new Fsrules()
// let rules = require('./ctrl/loadconf')
// test webpack
const webpack = require('webpack')
let keeper = require('../index')
// test i18n
let I18nPlugin = require('i18n-webpack-plugin')
// config
myinfor = rules.infor()
myseoinfor = rules.seoinfor()
let confdev = rules.dev()
let transfile = rules.transfile().transfile
let watcher, compiler

// constructor
class compile {
  constructor () {
    this.confobj = {
      output: {
        path: path.resolve('./static/'),
        chunkFilename: '[name].part.js?[chunkhash:8]'
      },
      resolve: {
        alias: {
          component: path.resolve('./front/plugin/component')
        }
      }
    }
    Object.assign(this.confobj, myinfor.config.webpack)
    delete this.confobj.config
  }

  reload () {
    rules.loadconfig()
    myinfor = rules.infor()
    confdev = rules.dev()
    // init
    myrules = rulinit.init()
    // transfile
    transfile = rules.transfile().transfile
    // clear
    confdel = ruldelete.delete()
    console.log('config is reload!'.green)
  }

  comsource (pub) {
    let dev = confdev.develop
    let myconfig = myinfor.config
    let lang = myinfor.lang
    let webpackconf = []
    for (let i in lang) {
      let myplugins = this.defaultplugin(pub, lang[i])
      // webpack
      let basepath = (myconfig.basepath ? myconfig.basepath + '/' : '')
      let tempobj = {
        plugins: myplugins,
        entry: {[basepath + lang[i] + 'source/js/' + dev]: ['./front/' + lang[i] + 'source/js/' + dev + '.js']},
        output: {filename: pub ? '[name].min.js' : '[name].js'}
      }
      Object.assign(tempobj.output, this.confobj.output)
      Object.assign(this.confobj, tempobj)
      webpackconf.push(this.confobj)
    }
    compiler = webpack(webpackconf)
  }

  defaultplugin (pub, lang) {
    let pubconf = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production') // production | true
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false},
        output: {comments: false}
      }),
      new webpack.BannerPlugin(myinfor.config.userinfor) // write author name into js
    ]

    let myplug
    if (lang === 'en/') {
      let mytrans = transfile.mytrans
      myplug = [
        new I18nPlugin(mytrans, {functionName: '_'})
      ]
      myplug.push(new keeper(confdev.webdev[1] || confdev.webdev[0]))
    } else {
      myplug = [
        new I18nPlugin('', {functionName: '_'})
      ]
      myplug.push(new keeper(confdev.webdev[0]))
    }

    if (pub) myplug = myplug.concat(pubconf)

    return myinfor.config.webpack.plugins.concat(myplug)
  }

  dev (param) {
    this.comsource()
    console.log('program is ready to compile,please wait...'.green)
    var config = myinfor.config.webpack.config
    watcher = compiler.watch({ // watch options:
      aggregateTimeout: 100, // wait so long for more changes
      poll: true // use polling instead of native watchers
      // pass a number to set the polling interval
    }, function (err, stats) {
      var result = stats.toString(config)
      console.log(result)
    })
  }

  outdev () {
    if (watcher) {
      console.log('exit development model...you can still use other command...'.blue)
      watcher.close()
    }
  }

  pub (param) {
    this.comsource(true)
    console.log('program is ready to compile,please wait...'.green)
    var config = myinfor.config.webpack.config
    compiler.run(function (err, stats) {
      var result = stats.toString(config)
      console.log(result)
      console.log('compile success'.blue)
    })
  }

  wrapconfig (pub) {
    let myconfig = myinfor.config
    let lang = myinfor.lang
    let webpackconf = []
    for (let i in lang) {
      let wrapdir = myconfig.wrapper.substr(0, myconfig.wrapper.lastIndexOf('/'))
      let wrappath = './front/' + lang[i] + wrapdir + '/' + myconfig.transfile
      if (fs.existsSync(wrappath)) {
        mytrans = JSON.parse(fs.readFileSync(wrappath).toString())
      } else {
        console.log(wrappath.green + ' trans file is missing!'.red)
      }

      let wranojs = myconfig.wrapper.substr(0, myconfig.wrapper.indexOf('.js'))
      let basepath = (myconfig.basepath ? myconfig.basepath + '/' : '')
      let myplugins = this.defaultplugin(pub, lang[i])
      let tempobj = {
        plugins: myplugins,
        entry: {[basepath + lang[i] + wranojs]: ['./front/' + lang[i] + myconfig.wrapper]},
        output: {filename: pub ? '[name].min.js' : '[name].js'}
      }
      Object.assign(tempobj.output, this.confobj.output)
      Object.assign(this.confobj, tempobj)
      webpackconf.push(tempobj)
    }
    compiler = webpack(webpackconf)
  }

  wrap (param) {
    param === 'pub' ? this.wrapconfig(param) : this.wrapconfig()
    console.log('program is ready to compile,please wait...'.green)
    var config = myinfor.config.webpack.config
    compiler.run(function (err, stats) {
      var result = stats.toString(config)
      console.log(result)
      console.log('compile success'.blue)
    })
  }
}

module.exports = compile
