/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
var fs = require('fs')
var phantom = require('phantom')
var config = require('../../config/robconf')
var delay = config.delay
var writefile = require('../base/writefile')
writefile = new writefile()

// constructor
function InitJs () {
  // Default options
  this.options = {}
}

// init the plugin 'phantom'
InitJs.prototype.initpm = function (url, cb) {
  var sitepage = null
  var phInstance = null
  var t = Date.now()
  var self = this
  var mylog = function () {
    progress.start()
  }

  // ignore error ssl and img
  phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'])
    .then(function (instance) {
      phInstance = instance
      return instance.createPage()
    })
    .then(function (page) {
      sitepage = page
      page.on('onResourceRequested', true, function (requestData, networkRequest) {
        var re = /[^http]+(.png|.jpg|.gif|.jpeg)$/g
        var isimg = re.test(requestData.url)
        if (isimg) {
          networkRequest.abort()
        }
      })
      return page.open(url)
    })
    .then(function (status) {
      if (status !== 'success') {
        console.log('FAIL to load the address'.red)
      } else {
        t = Date.now() - t
        console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
      }
      return sitepage.property('content')
    })
    .then(function (content) {
      if (content && content != '<html><head></head><body></body></html>') {
        // opration
        self.analysis(sitepage, cb)
      } else {
        console.log('file is loading failed!please check your proxy!'.red)
        Prompt.displayPrompt()
      }
      sitepage.close()
      phInstance.exit()
    })
    .catch(function (error) {
      console.log(error.red)
      phInstance.exit()
    })
}

InitJs.prototype.analysis = function (sitepage, cb) {
  // sitepage.render('test.png');
  sitepage.evaluate(function () {
    var node = document.createElement('p')
    node.innerText = '次网站是复制品，未经授权，请勿使用！'
    document.body.appendChild(node)
    document.getElementById('bd').remove()
    return document.getElementsByTagName('html')[0].innerHTML
  }).then(function (data) {
    cb(data)
  })
}

module.exports = InitJs
