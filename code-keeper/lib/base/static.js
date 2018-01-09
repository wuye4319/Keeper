/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
var fs = require('fs')
// var phantom = require('keeper-static')

const Render = require('keeper-core/lib/render')
let render = new Render()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

var fsprogress = require('./progress')
var progress = new fsprogress()

// constructor
class InitJs {
  // init the plugin 'phantom'
  staticpage (file, url, Prompt, param) {
    var sitepage = null
    var phInstance = null
    var t = Date.now()
    var mylog = function () {
      progress.start()
    }
    let myparam = ['--ignore-ssl-errors=yes', '--load-images=no']
    if (param == 'img') myparam = ['--ignore-ssl-errors=yes']

    phantom.create(myparam, {logger: {debug: mylog}})
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
          progress.toend()
          console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
        }
        return sitepage.property('content')
      })
      .then(function (content) {
        if (content && content != '<html><head></head><body></body></html>') {
          // opration
          sitepage.evaluate(function () {
            return document.getElementById('container').innerHTML
          }).then(function (html) {
            if (html.length) {
              // write file
              var tpl = fs.readFileSync(file).toString()
              var data = {container: html}
              var str = render.renderdata(tpl, data)
              var newfile = writefile.writejs(file, str)
              newfile ? console.log(file.yellow + ' is init sucessed!'.blue) : console.log(file.yellow + ' is init failed!'.red)
              progress.end(file.yellow + ' was overwrite!'.cyan)
              !Prompt || Prompt.displayPrompt()
            } else {
              console.log('html is empty!staic failed!'.red)
            }
          })
        } else {
          console.log('file is loading failed!please check your proxy!'.red)
          !Prompt || Prompt.displayPrompt()
        }
        sitepage.close()
        phInstance.exit()
      })
      .catch(function (error) {
        console.log(error.red)
        phInstance.exit()
      })
  }
}

module.exports = InitJs
