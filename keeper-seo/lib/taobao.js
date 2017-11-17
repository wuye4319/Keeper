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
      let cookiebox = []
      const page = await browser.newPage()

      try {
        page.on('response', async (result) => {
          let filter = result.url.indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url.indexOf('sib.htm') !== -1
          if (filter || filter2) {
            cookiebox = cookiebox.concat(await page.cookies(result.url))
            isali = true
            filterbox += await result.text()
          }
        })

        await page.goto(url, {waitUntil: 'networkidle', networkIdleTimeout: 1000})
        // await page.screenshot({path: 'example.png'})
        let cont = await page.content()
        // console.log(cont)

        let templine = '\n<script>\nvar apidata = '
        let endtempline = '\n</script>'
        let tmallkey = 'setMdskip'
        let taobaokey = 'onSibRequestSuccess'
        let chaoshi = 'onMdskip'
        if (filterbox.indexOf(tmallkey) !== -1 || filterbox.indexOf(taobaokey) !== -1 || filterbox.indexOf(chaoshi) !== -1) {
          filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
          filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
          console.log('Get ali api data success'.green)
        } else if (isali) {
          let loginurl = 'https://login.tmall.com/?from=sm&redirectURL='
          if (this.checklogin(cookiebox)) {
            console.log('page has already login!')
          } else {
            filterbox = await login.login(browser, loginurl + encodeURIComponent(url))
            loginstr = true
          }
        } else {
          console.log('Get other api data success'.green)
        }
        cont = cont + templine + filterbox + endtempline
        console.log(cookiebox)

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

  checklogin (cookiebox) {
    for (var i in cookiebox) {
      let key1 = 'lgc'
      let key2 = 'tracknick'
      if (cookiebox[i].name === key1 || cookiebox[i].name === key2) {
        return true
      } else {
        return false
      }
    }
  }
}

module.exports = InitJs
