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
let logincount = 0
const Http = require('./gethttp')
let http = new Http()

// constructor
class InitJs {
  async taobao (browser, type, url, opencache, autologin) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''
      let isali = false // page from ali
      let cookiebox = []
      let apidata = false
      let mylogstr = {}
      const page = await browser.newPage()

      try {
        // await page.setRequestInterception(true)
        // page.on('request', intercep => { intercep.continue() })
        page.on('response', async (result) => {
          let filter = result.url().indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url().indexOf('sib.htm') !== -1
          if (filter || filter2) {
            // http.getcode(result.url(), url)
            isali = true
            filterbox += await result.text()
          }
        })

        await page.goto(url)
        let cont = await page.content()

        let templine = '\n<script>\nvar apidata = '
        let endtempline = '\n</script>'
        let tmallkey = 'setMdskip'
        let taobaokey = 'onSibRequestSuccess'
        let chaoshi = 'onMdskip'
        let VerificationCode = 'taobao.com/query.htm'
        if (filterbox.indexOf(tmallkey) !== -1 || filterbox.indexOf(taobaokey) !== -1 || filterbox.indexOf(chaoshi) !== -1) {
          apidata = true
          filterbox = this.subresult(filterbox)
          // if previous api is failed, check this time
          if (logincount) logincount -= 1
        } else if (isali) { // filterbox is null or sth else
          // check login status, prevent repeat login
          if (this.checklogin(cookiebox)) {
            logger.myconsole('page has already login!')
            if (filterbox.indexOf(VerificationCode) !== -1) logger.myconsole('Verification Code!!!'.red)
          } else {
            // check login count, if get api failed more than 2 times, change ip first
            if (logincount < 1) {
              logincount += 1
              logger.myconsole('Analysis failed!'.red)
            } else {
              resolve('changeip')
              logincount = 0
            }

            // auto-login
            if (autologin) {
              let loginurl = 'https://login.tmall.com/?from=sm&redirectURL='
              filterbox = await login.login(page, loginurl, url)
              logger.myconsole('login count : '.green + logincount)
              if (filterbox && filterbox !== 'Auto-login failed!') {
                mylogstr.login = 1
                apidata = true
                console.log('Auto login successed! '.red + mytime.mytime())
                filterbox = this.subresult(filterbox)
              } else {
                mylogstr.login = 'failed'
                logger.myconsole('Auto login failed!'.red)
              }
            }
          }
        } else {
          logger.myconsole('Analysis failed! Product is missing!'.red)
        }
        cont = cont + templine + filterbox + endtempline
        // close page when analysis is done
        await page.close()
        resolve(cont)

        t = Date.now() - t
        mylogstr.Loadingtime = (t / 1000).toString() + ' s'
        mylogstr.date = mytime.mytime()
        mylogstr.url = url
        logger.myconsole(mytime.mytime())
        // write date
        if (opencache && apidata && filterbox) cache.writecache(cont, url, type)
        apidata && filterbox ? mylogstr.apidata = 'success' : mylogstr.apidata = 'Failed'
        logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)
        logger.mybuffer(mylogstr)
        logger.writelog('success', type)
      } catch (e) {
        resolve(false)
        logger.myconsole('System error!'.red)
        await page.close()
      }
    })
  }

  subresult (filterbox) {
    filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
    filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
    return filterbox
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
