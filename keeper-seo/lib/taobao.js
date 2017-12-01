/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Fslog = require('keeper-core')
let logger = new Fslog()

const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
const Login = require('./auto-login')
let login = new Login()
let myloginstatus = false

// constructor
class InitJs {
  async taobao (browser, type, url, opencache) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''
      let isali = false // page from ali
      let loginstr = false
      let cookiebox = []
      let apidata = false
      const page = await browser.newPage()

      try {
        page.on('response', async (result) => {
          let filter = result.url.indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url.indexOf('sib.htm') !== -1
          if (filter || filter2) {
            // cookiebox = cookiebox.concat(await page.cookies(result.url))
            isali = true
            filterbox += await result.text()
          }
        })

        await page.goto(url, {waitUntil: 'networkidle', networkIdleTimeout: 1000})
        let cont = await page.content()
        // console.log(cont)

        if (myloginstatus) logger.myconsole('Already Logged!'.red)

        let templine = '\n<script>\nvar apidata = '
        let endtempline = '\n</script>'
        let tmallkey = 'setMdskip'
        let taobaokey = 'onSibRequestSuccess'
        let chaoshi = 'onMdskip'
        let VerificationCode = 'taobao.com/query.htm'
        if (filterbox.indexOf(tmallkey) !== -1 || filterbox.indexOf(taobaokey) !== -1 || filterbox.indexOf(chaoshi) !== -1) {
          apidata = true
          filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
          filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
          logger.myconsole('Get ali api data success'.green)
        } else if (isali) {
          let loginurl = 'https://login.tmall.com/?from=sm&redirectURL='
          if (this.checklogin(cookiebox)) {
            logger.myconsole('page has already login!')
            if (filterbox.indexOf(VerificationCode) !== -1) logger.myconsole('Verification Code!!!'.red)
          } else {
            loginstr = true
            filterbox = await login.login(page, loginurl, url)
            if (filterbox && filterbox !== 'System error!Program stop working!') {
              apidata = true
              myloginstatus = true
              filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
              filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
              logger.myconsole('Get ali api data success'.green)
            }
          }
        } else {
          logger.myconsole('Get api data failed'.red)
        }
        cont = cont + templine + filterbox + endtempline
        // console.log(cont)
        // console.log(cookiebox)

        t = Date.now() - t
        let str = '{"Loadingtime":"' + (t / 1000).toString() + 's","date":"' + mytime.mytime() + '","url":"' + url + '"'
        if (filterbox === 'Auto-login failed!') {
          if (loginstr) str += ',"login":"failed"'
        } else {
          // write date
          if (opencache && apidata) str += cache.writecache(cont, url, type)
          apidata ? str += ',"apidata":"success"' : str += ',"apidata":"Failed"'
          if (loginstr) str += ',"login":1'
        }
        await page.close()

        logger.writelog('success', str + '}', type)
        resolve(cont)
        logger.myconsole('Loading time '.green + (t / 1000).toString().red + ' second'.green)
      } catch (e) {
        resolve(false)
        logger.myconsole('System error! Can not analysis this page!'.red)
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
