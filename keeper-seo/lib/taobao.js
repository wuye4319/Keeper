/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
let seoinfor = require('../config/seoinfor')

const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Fslog = require('keeper-core')
let log = new Fslog()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
const Login = require('./auto-login')
let login = new Login()

// constructor
class InitJs {
  async taobao (browser, type, url, opencache) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''
      let isali = false
      let loginstr = false
      const page = await browser.newPage()

      try {
        // await page.setRequestInterceptionEnabled(true)
        page.on('response', async (result) => {
          let filter = result.url.indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url.indexOf('sib.htm') !== -1
          if (filter || filter2) {
            isali = true
            filterbox += await result.text()
          }
        })

        await page.goto(url, {waitUntil: 'networkidle', networkIdleTimeout: 1000})
        // await page.screenshot({path: 'example.png'})
        let cont = await page.content()
        // console.log(cont)

        let templine = '\n\n=====================================================================================================================\n\n'
        if (filterbox.indexOf('setMdskip') != -1 || filterbox.indexOf('onSibRequestSuccess') != -1 || !isali) {
          console.log('get api data success'.green)
        } else {
          let loginurl = 'https://login.tmall.com/?from=sm&redirectURL='
          filterbox = await login.login(browser, loginurl + encodeURIComponent(url))
          loginstr = true
        }
        cont = cont + templine + filterbox

        // write date
        t = Date.now() - t
        let str = '{"Loadingtime":"' + (t / 1000).toString() + 's","date":"' + mytime.mytime() + '","url":"' + url + '",'
        if (opencache) str += cache.writecache(cont, url, type)
        if (loginstr) str += '"login":1,'
        log.writelog('success', str + '}', type)

        resolve(cont)
        console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
        await page.close()
      } catch (e) {
        resolve(false)
        console.log('System error! Can not analysis this page!'.red)
        await page.close()
      }
    })
  }
}

module.exports = InitJs
