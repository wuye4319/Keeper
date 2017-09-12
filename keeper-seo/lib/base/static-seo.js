/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const os = require('os')
const path = require('path')
const puppeteer = require('puppeteer')

const Render = require('keeper-core/lib/render')
let render = new Render()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const Fslog = require('keeper-core')
let log = new Fslog()

// constructor
class InitJs {
  async staticpage (file, url, seach) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      const browser = await puppeteer.launch({ignoreHTTPSErrors: true, timeout: 0})
      const page = await browser.newPage()

      await page.setRequestInterceptionEnabled(true)
      page.on('request', interceptedRequest => {
        // console.log(interceptedRequest.url)
        if (interceptedRequest.url.endsWith('.png') || interceptedRequest.url.endsWith('.jpg')) {
          interceptedRequest.abort()
        } else {
          interceptedRequest.continue()
        }
      })

      await page.goto(url)
      // await page.screenshot({path: 'example.png'})
      // console.log(await page.content())

      const mypageinfor = await page.evaluate(() => {
        return {
          title: document.title || '',
          keywords: document.getElementsByTagName('meta')[1].content || '',
          description: document.getElementsByTagName('meta')[2].content || '',
          content: document.getElementById('container').innerHTML || ''
        }
      })
      // console.log(mypageinfor)

      // write date
      let date = new Date()
      if (os.platform() === 'linux') {
        date.setHours(date.getHours() + 13)
      }
      t = Date.now() - t
      const bvs = await browser.version()
      let str = 'Loading time: ' + (t / 1000).toString() + ' second.  ' + date + '\n' + 'User Browser Version : ' + bvs + '.  ' +
        'Search Engines : ' + seach + '\n' + url + '\n'

      let file = path.join(__dirname, '/../../tpl/init/init.html')
      var tpl = fs.readFileSync(file).toString()
      var data = {
        title: mypageinfor.title,
        keywords: mypageinfor.keywords,
        description: mypageinfor.description,
        loadjs: '/plugin/base/load.js',
        container: '<div id="container" style="opacity: 0;">' + mypageinfor.content + '</div>',
        wrapjs: '/en/react-plugin/Wrap.min.js',
        myjs: '/en/source/js/buy/buy.js'
      }
      var mystr = render.renderdata(tpl, data)
      resolve(mystr)
      log.writelog('success', str)
      console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
      browser.close()
    })
  }
}

module.exports = InitJs
