/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const phantom = require('keeper-static')
const path = require('path')

let render = require('./render')
render = new render()
let writefile = require('./writefile')
writefile = new writefile()

let fsprogress = require('./progress')
let progress = new fsprogress()
let fslog = require('keeper-core')
let log = new fslog()

// constructor
class InitJs {
  // init the plugin 'phantom'
  async staticpage (file, url, seach) {
    let self = this
    return new Promise((resolve, reject) => {
      let sitepage = null
      let phInstance = null
      let t = Date.now()
      const mylog = function () {
        progress.start()
      }
      let str = null

      phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'], {logger: {debug: mylog}})
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
            // cache
            let date = new Date()
            str = 'Loading time: ' + (t / 1000).toString() + ' second.   ' + date + '.   Search Engines : ' + seach + '\n' + url + '\n'
          }
          return sitepage.property('content')
        })
        .then(function (content) {
          let seokey = null
          if (content && content != '<html><head></head><body></body></html>') {
            sitepage.evaluate(function () {
              return document.getElementById('container').getElementsByClassName('goods-title')[0].innerText
            }).then(function (text) {
              seokey = text
            })
            // opration
            sitepage.evaluate(function () {
              return document.getElementById('container').innerHTML
            }).then(async function (html) {
              if (html.length) {
                // write file
                // console.log(html)
                let file = path.join(__dirname, '/../../tpl/init/init.html')
                var tpl = fs.readFileSync(file).toString()
                seokey = seokey || ''
                var data = {
                  title: 'Superbuy-Shopping Agent,' + seokey,
                  keywords: '代购，Superbuy.com,Shopping Agent, Superbuy.com,' + seokey,
                  description: '代购，Superbuy.com,Shopping Agent, Superbuy.com,' + seokey,
                  loadjs: '/plugin/base/load.js',
                  container: '<div id="container" style="opacity: 0;">' + html + '</div>',
                  wrapjs: '/en/react-plugin/Wrap.min.js',
                  myjs: '/en/source/js/buy/buy.js'
                }
                var mystr = render.renderdata(tpl, data)
                // console.log(mystr)
                resolve(mystr)
                log.writelog('success', str)
                // var newfile = writefile.writejs(file, str)
                // progress.end(file.yellow + ' was overwrite!'.cyan)
              } else {
                resolve(false)
                log.writelog('error', str)
                console.log('html is empty!staic failed!'.red)
              }
            })
          } else {
            resolve(false)
            log.writelog('proxy error', str)
            console.log('file is loading failed!please check your proxy!'.red)
          }
          sitepage.close()
          phInstance.exit()
        })
        .catch(function (error) {
          console.log(error.red)
          phInstance.exit()
        })
    })
  }
}

module.exports = InitJs
