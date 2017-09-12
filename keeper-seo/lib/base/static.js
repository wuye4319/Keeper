/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const phantom = require('keeper-static')
const path = require('path')
const os = require('os')
let seoinfor = require('../../config/seoinfor')

let Fsrender = require('keeper-core/lib/render')
const render = new Fsrender()

let Fsprogress = require('keeper-core/lib/progress')
const progress = new Fsprogress()
let Fslog = require('keeper-core')
let log = new Fslog()
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()

// constructor
class InitJs {
  // init the plugin 'phantom'
  async staticpage (type, url, seach, title) {
    return new Promise((resolve) => {
      let sitepage = null
      let phInstance = null
      let t = Date.now()
      const mylog = function () {
        // progress.start()
      }
      let str = null

      phantom.create(['--ignore-ssl-errors=yes'], {logger: {debug: mylog}})
        .then(function (instance) {
          phInstance = instance
          return instance.createPage()
        })
        .then(function (page) {
          sitepage = page
          page.on('onResourceRequested', true, function (requestData, networkRequest) {
            // png
            var re = /[^http]+.*?(jpg|jpeg)$/g
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
            if (os.platform() === 'linux') {
              date.setHours(date.getHours() + 13)
            }
            str = 'Loading time: ' + (t / 1000).toString() + ' second.   ' + date + '.   Search Engines : ' + seach + '\n' + url + '\n'
          }
          return sitepage.property('content')
        })
        .then(function (content) {
          let seokey = ''
          if (content && content != '<html><head></head><body></body></html>') {
            // title
            if (title) {
              sitepage.evaluate(function () {
                return document.getElementById('container').getElementsByClassName('goods-title')[0].innerText
              }).then(function (text) {
                seokey = text
                console.log(text)
              })
            }

            // content for html
            sitepage.evaluate(function () {
              return document.getElementById('container').innerHTML
            }).then(async function (html) {
              if (html.length) {
                // console.log(html)
                // write file
                let file = path.join(__dirname, '/../../tpl/init/init.html')
                var tpl = fs.readFileSync(file).toString()
                let currpageinfor = seoinfor[type]
                var data = {
                  title: seokey + currpageinfor.title,
                  keywords: '',
                  description: currpageinfor.description + seokey,
                  loadjs: '/plugin/base/load.js',
                  container: '<div id="container" style="opacity: 0;">' + html + '</div>',
                  wrapjs: currpageinfor.wrapjs,
                  myjs: currpageinfor.myjs
                }
                var mystr = render.renderdata(tpl, data)
                if (!!seokey || type === 'subject') {
                  cache.writecache(mystr, url)
                }
                resolve(mystr)
                log.writelog('success', str + (!title || seokey + '\n'))
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
