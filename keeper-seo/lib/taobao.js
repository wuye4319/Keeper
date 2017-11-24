/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
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
        let cont = await page.content()
        // console.log(cont)

        let templine = '\n<script>\nvar apidata = '
        let endtempline = '\n</script>'
        let tmallkey = 'setMdskip'
        let taobaokey = 'onSibRequestSuccess'
        let chaoshi = 'onMdskip'
        let VerificationCode = 'taobao.com/query.htm'
        if (filterbox.indexOf(tmallkey) !== -1 || filterbox.indexOf(taobaokey) !== -1 || filterbox.indexOf(chaoshi) !== -1) {
          filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
          filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
          console.log('Get ali api data success'.green)
        } else if (isali) {
          let loginurl = 'https://login.tmall.com/?from=sm&redirectURL='
          if (this.checklogin(cookiebox)) {
            console.log('page has already login!')
            if (filterbox.indexOf(VerificationCode) !== -1) console.log('Verification Code!!!'.red)
          } else {
            loginstr = true
            filterbox = await login.login(page, loginurl, url)
            filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
            filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
            console.log('Get ali api data success'.green)
          }
        } else {
          console.log('Get other api data success'.green)
        }
        cont = cont + templine + filterbox + endtempline
        // console.log(cookiebox)

        t = Date.now() - t
        let str = '{"Loadingtime":"' + (t / 1000).toString() + 's","date":"' + mytime.mytime() + '","url":"' + url + '"'
        if (filterbox === 'System error!Program stop working!') {
          await browser.close()
          if (loginstr) str += ',"login":"failed"'
        } else {
          // write date
          if (opencache) str += cache.writecache(cont, url, type)
          if (loginstr) str += ',"login":1'
          await page.close()
        }

        log.writelog('success', str + '}', type)
        resolve(cont)
        console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
      } catch (e) {
        resolve(false)
        console.log('System error! Can not analysis this page!'.red)
        await page.close()
      }
    })
  }

  checklogin (cookiebox) {
    let result = false
    for (var i in cookiebox) {
      let key1 = 'lgc'
      let key2 = 'tracknick'
      if (cookiebox[i].name === key1 || cookiebox[i].name === key2) {
        result = true
        break
      }
    }
    return result
  }
}

module.exports = InitJs
