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
let apidata = false

// constructor
class InitJs {
  async getcont (cont, filterbox, selfbrowser) {
    return new Promise(async resolve => {
      let isjson = false
      let templine = '\n<script>\nvar apidata = '
      let endtempline = '\n</script>'
      if (!cont) logger.myconsole('Html cont is empty!'.red)

      if (filterbox) {
        let tempstr = this.subresult(filterbox)
        if (tempstr) filterbox = tempstr
        isjson = this.isJson(filterbox)
        if (isjson) {
          apidata = true
          // if previous api is success, reduce
          if (logincount) logincount -= 1
        } else {
          let befailed = await this.befailed(filterbox, selfbrowser)
          if (befailed === 'changeip') { resolve('changeip') } else { resolve('Analysis failed!') }
        }
      } else {
        logger.myconsole('Filterbox is empty!'.yellow)
      }

      cont = cont + templine + filterbox + endtempline
      resolve(cont)
    })
  }

  async taobao (browser, type, url, opencache, selfbrowser) {
    return new Promise(async (resolve) => {
      logger.myconsole(mytime.mytime())
      let t = Date.now()
      let filterbox = ''
      let cont = ''
      let isali = false // page from ali
      // let cookiebox = []
      let mylogstr = {}
      const page = await browser.newPage()
      apidata = false

      try {
        let waitcont = async () => {
          if (!cont) {
            setTimeout(function () {
              waitcont()
            }, 100)
          } else {
            cont = await this.getcont(cont, filterbox, selfbrowser)
            resolve(cont)
            t = Date.now() - t
            mylogstr.Loadingtime = (t / 1000).toString() + ' s'
            logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)
          }
        }

        // await page.setRequestInterception(true)
        // page.on('request', intercep => { intercep.continue() })
        page.on('response', async (result) => {
          let filter = result.url().indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url().indexOf('sib.htm') !== -1
          if (filter || filter2) {
            isali = true
            filterbox += await result.text()
            // filterbox = await http.getcode(result.url(), url)
            waitcont()
          }
          if (result.url() === url) {
            cont = await result.text()
          }
        })

        await page.goto(url)
        // let cont = await page.content()
        // console.log(filterbox)

        // close page when analysis is done
        await page.close()
        if (!isali) {
          logger.myconsole('Product is missing!'.yellow)
          resolve('Product is missing!')
        }

        mylogstr.date = mytime.mytime()
        mylogstr.url = url
        // write date
        if (opencache && apidata && filterbox) cache.writecache(cont, url, type)
        apidata && filterbox ? mylogstr.apidata = 'success' : mylogstr.apidata = 'Failed'

        logger.mybuffer(mylogstr)
        logger.writelog('success', type)
      } catch (e) {
        resolve(false)
        logger.myconsole('System error! Or page timeout!'.red)
        await page.close()
      }
    })
  }

  async befailed (filterbox, cookiebox, selfbrowser) {
    // check login count, if get api failed more than 2 times, change ip first
    if (selfbrowser) {
      logger.myconsole('Self browser analysis failed!'.red)
    } else {
      logger.myconsole('Analysis failed!'.red)
    }

    if (logincount < 1) {
      logincount += 1
    } else {
      logincount = 0
      return 'changeip'
    }
    return false
  }

  isJson (obj) {
    try {
      obj = JSON.parse(obj)
      let isjsonstr = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
      if (isjsonstr) {
        let verifystr = obj.toString().indexOf('detailskip.taobao.com/__x5__/query.htm')
        if (verifystr !== -1) {
          return false
        } else {
          return true
        }
      }
    } catch (e) {
      return false
    }
  }

  subresult (filterbox) {
    filterbox = filterbox.substr(filterbox.indexOf('(') + 1)
    filterbox = filterbox.substr(0, filterbox.lastIndexOf(')'))
    return filterbox
  }

  checklogin (cookiebox) {
    let result = false
    for (let i in cookiebox) {
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
