/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Fslog = require('keeper-core/logger/logger')
let logger = new Fslog()

const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
let logincount = 0
let apidata = false

// constructor
class InitJs {
  async getcont (cont, selfbrowser, url) {
    return new Promise(async resolve => {
      let isjson = false
      isjson = this.isJson(cont)
      if (isjson && cont) {
        apidata = true
        // if previous api is success, reduce
        if (logincount && !selfbrowser) logincount -= 1
      } else {
        let befailed = await this.befailed(cont, selfbrowser, url)
        if (befailed === 'changeip') { resolve('changeip') } else { resolve('Analysis failed!') }
      }

      // cont = cont + templine + filterbox + endtempline
      resolve(cont)
    })
  }

  async taobao (browser, type, url, opencache, process, selfbrowser) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let cont = ''
      let isali = false // page from ali
      // let cookiebox = []
      let mylogstr = {}
      let page = await browser.newPage()
      apidata = false
      // let proid = url.substr(url.lastIndexOf('/'))
      logger.myconsole(mytime.mytime())
      logger.myconsole('<p>' + mytime.mytime() + '</p>', 'web')

      try {
        let waitcont = async (index, cont) => {
          index += 1
          if (index > 60) {
            cont = 'Failed'
            logger.myconsole('Wait api data failed!'.red)
            logger.myconsole('<p style="color: red">Wait api data failed!</p>', 'web')
          }

          if (!cont) {
            console.log(cont, index)
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index, cont)
            }, 100)
          } else {
            logger.myconsole('Web page opens normally '.green + process + (selfbrowser ? ', backup service!'.red : ''))
            logger.myconsole('<p style="color: green">Web page opens normally ' + process +
              (selfbrowser ? ', <span style="color: red">backup service!</span>' : '') + '</p>', 'web')
            cont = await this.getcont(cont, selfbrowser, url)
            resolve(cont)
            t = Date.now() - t
            mylogstr.Loadingtime = (t / 1000).toString() + ' s'
            logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)
            logger.myconsole('<p style="color: green">Loading time : <span style="color: red">' + mylogstr.Loadingtime + '</span></p>', 'web')

            if (opencache && apidata && cont) cache.writecache(cont, url, type)
            apidata && cont ? mylogstr.apidata = 'success' : mylogstr.apidata = 'Failed'
          }
        }

        // await page.setRequestInterception(true)
        // page.on('request', intercep => { intercep.continue() })
        page.on('response', async (result) => {
          if (!isali) {
            let filter = result.url().indexOf('items/search.json') !== -1
            if (filter) {
              try {
                cont = await result.text()
                isali = true
                waitcont(0, cont)
              } catch (e) {
                resolve('Analysis failed!')
                logger.myconsole('Get filter failed!'.red + process + e)
                logger.myconsole('<p style="color: red">Get filter failed!</p>' + process + e, 'web')
              }
            }
          }
        })

        await page.goto(url, {waitUntil: 'networkidle2'})
        // let cont = await page.content()
        // close page when analysis is done
        await page.close()
        if (!isali) {
          selfbrowser ? logger.myconsole('Self browser product is missing! '.yellow + process) : logger.myconsole('Product is missing! '.yellow +
            process)
          selfbrowser
            ? logger.myconsole('<p style="color: yellow">Self browser product is missing! </p>' + process, 'web')
            : logger.myconsole('<p style="color: yellow">Product is missing! </p>' + process, 'web')
          resolve('Product is missing!')
        }
        mylogstr.date = mytime.mytime()
        mylogstr.url = url
        // write date
        logger.mybuffer(mylogstr)
        logger.writelog('success', type)
      } catch (e) {
        resolve(false)
        logger.myconsole('System error! Or page timeout!'.red)
        logger.myconsole('<p style="color: red">System error! Or page timeout!</p>', 'web')
        await page.close()
      }
    })
  }

  async befailed (filterbox, selfbrowser, url) {
    // check login count, if get api failed more than 2 times, change ip first
    selfbrowser ? logger.myconsole('Self browser analysis failed!'.red) : logger.myconsole('Analysis failed!'.red)
    selfbrowser ? logger.myconsole('<p style="color: red">Self browser analysis failed!</p>', 'web') : logger.myconsole(
      '<p style="color: red">Analysis failed!</p>', 'web')
    if (!selfbrowser) {
      if (logincount < 1) {
        logincount += 1
      } else {
        logincount = 0
        return 'changeip'
      }
    }
    cache.writecache(filterbox, url, 'error')

    return false
  }

  isJson (obj) {
    try {
      obj = JSON.parse(obj)
      let isjsonstr = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
      if (isjsonstr) {
        // let verifystr = JSON.stringify(obj).indexOf('//detailskip.taobao.com:443/service/getData/1/p1/item/detail/sib.htm')
        // let verifystr2 = JSON.stringify(obj).indexOf('sec.taobao.com/query.htm?smApp')
        let verifystrLogin = JSON.stringify(obj).indexOf('www.alimama.com/member/login.htm?style=')
        // console.log(verifystr2, verifystr)
        if (verifystrLogin !== -1) {
          logger.myconsole('Login redirect!'.red)
          logger.myconsole('<p style="color: red">Login redirect!</p>', 'web')
          return false
          // } else if (verifystr !== -1 || verifystr2 !== -1) {
          //   logger.myconsole('Verification Code!'.red)
          //   logger.myconsole('<p style="color: red">Verification Code!</p>', 'web')
          //   return false
        } else {
          return true
        }
      }
    } catch (e) {
      return false
    }
  }
}

module.exports = InitJs
