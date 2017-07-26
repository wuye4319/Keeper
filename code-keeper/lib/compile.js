/**
 * author:nero
 * version:v1.0
 * plugin:code-keeper
 */
var fs = require('fs')
const path = require('path')
var fsrules = require('./rules')
var rules = new fsrules()
var fsrender = require('./base/render')
render = new fsrender()
var writefile = require('./base/writefile')
writefile = new writefile()
// test webpack
const webpack = require('webpack')
var keeper = require('code-keeper')
// test i18n
var I18nPlugin = require('i18n-webpack-plugin')
// config
myinfor = rules.infor()
myseoinfor = rules.seoinfor()
var confdev = rules.dev()
var transfile = rules.transfile().transfile

// constructor
function compile () {
}
// reload
compile.prototype.reload = function () {
  var file = __dirname + '/rules.js'
  var configstr = fs.readFileSync(file).toString()
  var temprules = eval(configstr)
  rules = new temprules()
  myinfor = rules.infor()
  confdev = rules.dev()
    // init
  myrules = rulinit.init()
    // transfile
  transfile = rules.transfile().transfile
    // release
  confrelease = rulrelease.release().release
    // clear
  confdel = ruldelete.delete()
  console.log('config is reload!'.green)
}

compile.prototype.comsource = function (pub, wrap) {
  var dev = confdev.develop, myconfig = myinfor.config
  var webpackconf = []
  var lang = myinfor.lang
  var pubconf = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')// production | true
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      output: {comments: false}
    })
  ]
  for (i in lang) {
    var myplugins, myplug, mytrans
    if (lang[i] == 'en/') {
      if (wrap) {
        var wrapdir = myconfig.wrapper.substr(0, myconfig.wrapper.lastIndexOf('/'))
        var wrappath = './front/' + lang[i] + wrapdir + '/' + myconfig.transfile
        if (fs.existsSync(wrappath)) {
          mytrans = JSON.parse(fs.readFileSync(wrappath).toString())
        } else {
          console.log(wrappath.green + ' trans file is missing!'.red)
        }
      } else {
        mytrans = transfile.mytrans
      }
      myplug = [
        new I18nPlugin(mytrans, {functionName: '_'})
      ]
      wrap || myplug.push(new keeper(confdev.webdev[1] || confdev.webdev[0]))
    } else {
      myplug = [
        new I18nPlugin('', {functionName: '_'})
      ]
      wrap || myplug.push(new keeper(confdev.webdev[0]))
    }
    pub ? myplug = myplug.concat(pubconf) : ''
    myplugins = myconfig.webpack.plugins.concat(myplug)
        // webpack
    var basepath = (myconfig.basepath ? myconfig.basepath + '/' : '')
    var wranojs = myconfig.wrapper.substr(0, myconfig.wrapper.indexOf('.js'))
    var tempobj = {
      plugins: myplugins,
      entry: {[basepath + lang[i] + (wrap ? wranojs : 'source/js/' + dev)]: ['./front/' + lang[i] + (wrap ? myconfig.wrapper : 'source/js/' + dev + '.js')]},
      externals: myconfig.webpack.externals,
      output: {
        path: path.resolve('./static/'),
        filename: '[name].js',
        chunkFilename: '[name].part.js?[chunkhash:8]'
      },
      resolve: {
        alias: {
          component: path.resolve('./front/plugin/component')
        }
      },
      module: myconfig.webpack.module
    }
    webpackconf.push(tempobj)
  }
  compiler = webpack(webpackconf)
}
var watcher
var compiler
// dev
compile.prototype.dev = function (param) {
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
// outdev
compile.prototype.outdev = function () {
  if (watcher) {
    console.log('exit development model...you can still use other command...'.blue)
    watcher.close()
  }
}
// pub
compile.prototype.pub = function (param) {
  this.comsource(true)
  console.log('program is ready to compile,please wait...'.green)
  var config = myinfor.config.webpack.config
  compiler.run(function (err, stats) {
    var result = stats.toString(config)
    console.log(result)
    console.log('compile success'.blue)
  })
}
// wrap
compile.prototype.wrap = function (param) {
  this.comsource(true, true)
  console.log('program is ready to compile,please wait...'.green)
  var config = myinfor.config.webpack.config
  compiler.run(function (err, stats) {
    var result = stats.toString(config)
    console.log(result)
    console.log('compile success'.blue)
  })
}

module.exports = compile
