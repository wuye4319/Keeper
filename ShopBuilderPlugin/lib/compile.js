/**
 * author:nero
 * version:v1.1
 * plugin:code-keeper
 */
const fs = require('fs')
const path = require('path')
const Fsrules = require('./ctrl/loadconf')
let rules = new Fsrules()
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
        // path: path.resolve('./static/'),
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

  reload (url) {
    rules.loadconfig(url)
    lang = myinfor.lang
    // confdev = rules.dev(true)
    console.log('config is reload!'.green)
  }

  comsource (pub, user) {
    let webpackconf = []
    for (let i in lang) {
      let confdev = rules.dev(pub, lang[i], user)
      console.log(confdev.input + '\n', confdev.output)
      if (fs.existsSync(confdev.input)) {
        let myplugins = this.defaultplugin(pub, lang[i], confdev)
        // webpack
        let tempobj = {
          plugins: myplugins,
          entry: {[confdev.output]: [confdev.input]},
          output: {filename: pub ? '[name].min.js' : '[name].js'}
        }
        // if (myconfig.webpack.devtool) tempobj.devtool = (pub ? myconfig.webpack.devtool[1] : myconfig.webpack.devtool[0])
        Object.assign(tempobj.output, this.confobj.output)
        webpackconf.push({...this.confobj, ...tempobj})
      } else {
        console.log('Input is error!'.red)
        return false
      }
    }
    return webpack(webpackconf)
  }

  defaultplugin (pub, lang, confdev, wrap) {
    let transfile = this.checktrans(lang)
    let pubconf = [
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
      wrap || myplug.push(new keeper(confdev.webdev))
    } else {
      myplug = [
        new I18nPlugin('', {functionName: '_'})
      ]
      // wrap do not need html
      wrap || myplug.push(new keeper(confdev.webdev))
    }

    if (pub) myplug = myplug.concat(pubconf)
    return myinfor.config.webpack.plugins.concat(myplug)
  }

  pub (url, user) {
    this.reload(url)
    compiler = this.comsource(true, user)
    if (compiler) {
      console.log('program is ready to compile,please wait...'.green)
      let config = myinfor.config.webpack.config
      compiler.run(function (err, stats) {
        let result = stats.toString(config)
        console.log(result)
        console.log('compile success'.blue)
      })
    }
  }

  wrapconfig (user, pub) {
    let webpackconf = []
    let mytrans
    for (let i in lang) {
      // let wrapdir = myconfig.wrapper.substr(0, myconfig.wrapper.lastIndexOf('/'))
      // let wrappath = './front/en/' + wrapdir + '/' + myconfig.transfile
      // if (fs.existsSync(wrappath)) {
      //   mytrans = JSON.parse(fs.readFileSync(wrappath).toString())
      // } else {
      //   console.log(wrappath.green + ' trans file is missing!'.red)
      // }
      let wrap = rules.wrap(lang[i], user)
      let myplugins = this.defaultplugin(pub, lang[i], '', mytrans || true) // wrap must be true
      console.log(wrap.input + '\n', wrap.output)
      if (fs.existsSync(wrap.input)) {
        let tempobj = {
          plugins: myplugins,
          entry: {[wrap.output]: [wrap.input]},
          output: {filename: pub ? '[name].min.js' : '[name].js'}
        }
        Object.assign(tempobj.output, this.confobj.output)
        // Object.assign(this.confobj, tempobj)
        webpackconf.push({...this.confobj, ...tempobj})
      } else {
        console.log('Input is error!'.red)
        return false
      }
    }
    return webpack(webpackconf)
  }

  wrap (user) {
    compiler = this.wrapconfig(user, 'pub')
    if (compiler) {
      console.log('program is ready to compile,please wait...'.green)
      let config = myinfor.config.webpack.config
      compiler.run((err, stats) => {
        let result = stats.toString(config)
        console.log(result)
        console.log('compile success'.blue)
      })
    }
  }
}

module.exports = compile
