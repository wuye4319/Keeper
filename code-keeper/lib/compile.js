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
let myinfor = rules.infor()
let watcher, compiler
let lang = myinfor.lang

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
    for (let i in lang) {
      this.checktrans(lang[i])
    }
  }

  checktrans (lang) {
    let transfile
    let firstlang = myinfor.config.firstlang + '/'
    if (lang !== firstlang) {
      transfile = rules.transfile(lang).transfile
    }
    return transfile
  }

  reload () {
    rules.loadconfig()
    myinfor = rules.infor()
    lang = myinfor.lang
    console.log('config is reload!'.green)
  }

  comsource (pub) {
    let confdev = rules.dev(pub)
    let dev = confdev.develop
    let myconfig = myinfor.config
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
      if (myconfig.webpack.devtool) tempobj.devtool = (pub ? myconfig.webpack.devtool[1] : myconfig.webpack.devtool[0])
      Object.assign(tempobj.output, this.confobj.output)
      webpackconf.push({...this.confobj, ...tempobj})
    }
    compiler = webpack(webpackconf)
  }

  defaultplugin (pub, lang, wrap) {
    let transfile = this.checktrans(lang)
    let confdev = rules.dev(pub)
    let pubconf = [
      // new webpack.DefinePlugin({
      //   'process.env': {
      //     NODE_ENV: JSON.stringify(pub ? true : 'production') // production | true
      //   }
      // }),
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {warnings: false},
      //   output: {comments: false}
      // }),
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        sourceMap: false,
        parallel: true,
        exclude: /node_modules/,
        uglifyOptions: {
          output: {
            comments: false,
            beautify: false
          }
        }
      }),
      new webpack.BannerPlugin(myinfor.config.userinfor) // write author name into js
    ]

    let myplug
    if (lang === 'en/') {
      myplug = [
        new I18nPlugin(wrap || transfile, {functionName: '_'})
      ]
      wrap || myplug.push(new keeper(confdev.webdev[1] || confdev.webdev[0]))
    } else {
      myplug = [
        new I18nPlugin('', {functionName: '_'})
      ]
      // wrap do not need html
      wrap || myplug.push(new keeper(confdev.webdev[0]))
    }

    if (pub) myplug = myplug.concat(pubconf)
    return myinfor.config.webpack.plugins.concat(myplug)
  }

  dev (param) {
    this.comsource()
    console.log('program is ready to compile,please wait...'.green)
    let config = myinfor.config.webpack.config
    watcher = compiler.watch({
      // aggregateTimeout: 100, // wait so long for more changes
      // poll: true // use polling instead of native watchers
      // pass a number to set the polling interval
    }, (err, stats) => {
      let result = stats.toString(config)
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
    let config = myinfor.config.webpack.config
    compiler.run((err, stats) => {
      let result = stats.toString(config)
      console.log(result)
      console.log('compile success'.blue)
    })
  }

  wrapconfig (pub) {
    let myconfig = myinfor.config
    let webpackconf = []
    let mytrans
    for (let i in lang) {
      let wrapdir = myconfig.wrapper.substr(0, myconfig.wrapper.lastIndexOf('/'))
      let wrappath = './front/en/' + wrapdir + '/' + myconfig.transfile
      if (fs.existsSync(wrappath)) {
        mytrans = JSON.parse(fs.readFileSync(wrappath).toString())
      } else {
        console.log(wrappath.green + ' trans file is missing!'.red)
      }

      let wranojs = myconfig.wrapper.substr(0, myconfig.wrapper.indexOf('.js'))
      let basepath = (myconfig.basepath ? myconfig.basepath + '/' : '')
      let myplugins = this.defaultplugin(pub, lang[i], mytrans || true) // wrap must be true
      let tempobj = {
        plugins: myplugins,
        entry: {[basepath + lang[i] + wranojs]: ['./front/' + lang[i] + myconfig.wrapper]},
        output: {filename: pub ? '[name].min.js' : '[name].js'}
      }
      Object.assign(tempobj.output, this.confobj.output)
      // Object.assign(this.confobj, tempobj)
      webpackconf.push({...this.confobj, ...tempobj})
    }
    compiler = webpack(webpackconf)
  }

  wrap (param) {
    param === 'pub' ? this.wrapconfig(param) : this.wrapconfig()
    console.log('program is ready to compile,please wait...'.green)
    let config = myinfor.config.webpack.config
    compiler.run((err, stats) => {
      let result = stats.toString(config)
      console.log(result)
      console.log('compile success'.blue)
    })
  }
}

module.exports = compile
