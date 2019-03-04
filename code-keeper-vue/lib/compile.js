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
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
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
    let myconfig = myinfor.config
    let webpackconf = []
    for (let i in lang) {
      let confdev = rules.dev(pub, lang[i])
      if (fs.existsSync(confdev.input)) {
        let myplugins = this.defaultplugin(pub, lang[i], confdev)
        // webpack
        let tempobj = {
          plugins: myplugins,
          // entry: {[basepath + lang[i] + 'source/js/' + dev]: ['./front/' + lang[i] + 'source/js/' + dev + '.js']},
          entry: {[confdev.output]: [confdev.input]},
          output: {filename: pub ? '[name].min.js' : '[name].js'}
        }
        if (myconfig.webpack.devtool) tempobj.devtool = (pub ? myconfig.webpack.devtool[1] : myconfig.webpack.devtool[0])
        Object.assign(tempobj.output, this.confobj.output)
        webpackconf.push({...this.confobj, ...tempobj})
      } else {
        console.log(confdev.input + '\n', confdev.output)
        console.log('Input is error!'.red)
        return false
      }
    }
    compiler = webpack(webpackconf)
  }

  defaultplugin (pub, lang, confdev, wrap) {
    let transfile = this.checktrans(lang)
    let pubconf = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(pub ? 'production' : 'development') // production | true
        }
      }),
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
    myplug = [
      new I18nPlugin(wrap || transfile, {functionName: '_'})
    ]
    wrap || myplug.push(new keeper(confdev.webdev))

    if (pub) myplug = myplug.concat(pubconf)
    return myinfor.config.webpack.plugins.concat(myplug)
  }

  dev (param) {
    this.comsource(false)
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
    let webpackconf = []
    let mytrans
    let myconfig = myinfor.config
    for (let i in lang) {
      let wrap = rules.wrap(lang[i])
      if (lang[i]) {
        if (fs.existsSync(wrap.mypath)) {
          mytrans = JSON.parse(fs.readFileSync(wrap.mypath).toString())
        } else {
          console.log(wrap.mypath.green + ' trans file is missing!'.red)
        }
      }

      let myplugins = this.defaultplugin(pub, lang[i], '', mytrans || true) // wrap must be true
      // console.log(wrap.input, wrap.output)
      if (fs.existsSync(wrap.input)) {
        let tempobj = {
          plugins: myplugins,
          entry: {[wrap.output]: [wrap.input]},
          // entry: {[basepath + lang[i] + wranojs]: ['./front/' + lang[i] + myconfig.wrapper]},
          output: {filename: pub ? '[name].min.js' : '[name].js'}
        }
        if (myconfig.webpack.devtool) tempobj.devtool = (pub ? myconfig.webpack.devtool[1] : myconfig.webpack.devtool[0])
        Object.assign(tempobj.output, this.confobj.output)
        // Object.assign(this.confobj, tempobj)
        webpackconf.push({...this.confobj, ...tempobj})
      } else {
        console.log('Input is error!'.red)
        return false
      }
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
