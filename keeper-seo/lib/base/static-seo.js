/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
var fs = require('fs')
var phantom = require('keeper-static')

var render = require('./render')
render = new render()
var writefile = require('./writefile')
writefile = new writefile()
let fslog = require('keeper-core')
let log = new fslog()

// constructor
class InitJs {
  // init the plugin 'phantom'
  async staticpage (file, url, seach) {
    return new Promise(async (resolve) => {
      var t = Date.now()
      const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'])
      const page = await instance.createPage()
      await page.on('onResourceRequested', function (requestData) {
        // console.log(requestData.url)
      })

      // count time
      const status = await page.open(url)
      if (status !== 'success') {
        console.log('FAIL to load the address'.red)
      } else {
        t = Date.now() - t
        console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
      }

      // cache
      let date = new Date()
      let str = 'Loading time: ' + (t / 1000).toString() + ' second.   ' + date + '.   Search Engines : ' + seach + '\n' + url + '\n'
      const content = await page.property('content')
      if (content && content != '<html><head></head><body></body></html>') {
        // opration
        page.evaluate(function () {
          return document.getElementById('container').innerHTML
        }).then(function (html) {
          if (html.length) {
            // write file
            // var tpl = fs.readFileSync(file).toString()
            // var data = {container: html}
            // var str = render.renderdata(tpl, data)
            // var newfile = writefile.writejs(file, str)
            // newfile ? console.log(file.yellow + ' is init sucessed!'.blue) : console.log(file.yellow + ' is init failed!'.red)
          } else {
            console.log('html is empty!staic failed!'.red)
          }
        })
        log.writelog('success', str)
        resolve(content)
      } else {
        log.writelog('error', str)
        console.log('file is loading failed!please check your proxy!'.red)
        resolve(false)
      }

      await instance.exit()
    })
  }
}

module.exports = InitJs
