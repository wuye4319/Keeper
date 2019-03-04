/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Fslog = require('keeper-core')
let logger = new Fslog()
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
// const SlideLock = require('./slidelock')
// let slidelock = new SlideLock()
let logincount = 0
let apidata = false

// constructor
class InitJs {
  async getcont (browser, cont, selfbrowser, url) {
    return new Promise(async resolve => {
      let isjson = false
      if (cont === 'Failed') cont = false
      let templine = '\n<script>\nvar apidata = '
      let endtempline = '\n</script>'

      // let str = cont.match(/<script>var _DATA_Mdskip =  ([\s\S]+) <\/script>\s+<script src=/)[1]
      isjson = cont ? this.isJson(cont, browser) : false
      if (isjson && cont) {
        apidata = true
        // if previous api is success, reduce
        if (logincount && !selfbrowser) logincount -= 1
      } else {
        let befailed = await this.befailed(cont, selfbrowser, url)
        if (befailed === 'changeip') { resolve('changeip') } else { resolve('Analysis failed!') }
      }

      cont = templine + cont + endtempline
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
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')
      apidata = false
      let proid = url.substr(url.lastIndexOf('/'))
      logger.myconsole(mytime.mytime())

      try {
        let waitcont = async (index) => {
          index += 1
          if (index > 60) {
            cont = 'Failed'
            resolve(cont)
            logger.myconsole('Wait cont failed!'.red)
          }

          if (!cont) {
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index)
            }, 100)
          } else {
            isali = true
            if (cont.indexOf('h5.m.taobao.com/detailplugin/expired.html') !== -1) {
              selfbrowser ? logger.myconsole('Self browser product is missing! '.yellow + process) : logger.myconsole('Product is missing! '.yellow +
                process)
              resolve('Product is missing!')
            } else {
              logger.myconsole('Web page opens normally '.green + process + (selfbrowser ? ', backup service!'.red : ''))
              cont = await this.getcont(browser, cont, selfbrowser, url)
              resolve(cont)
              t = Date.now() - t
              mylogstr.Loadingtime = (t / 1000).toString() + ' s'
              logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)
            }
          }
        }

        // await page.setRequestInterception(true)
        // page.on('request', intercep => { intercep.continue() })
        page.on('response', async (result) => {
          if (!isali) {
            if (result.url().indexOf(proid) !== -1) {
              try {
                cont += await result.text()
                await waitcont(0, cont)
              } catch (e) {
                logger.myconsole(e + ' ' + process)
              }
            }
          }
        })
        await page.goto(url)
        // let cont = await page.content()
        // console.log(filterbox)
        // close page when analysis is done
        await page.close()
        if (!isali) {
          selfbrowser ? logger.myconsole('Self browser product is missing! '.yellow + process) : logger.myconsole('Product is missing! '.yellow +
            process)
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
        await page.close()
      }
    })
  }

  async befailed (cont, selfbrowser, url) {
    // check login count, if get api failed more than 2 times, change ip first
    selfbrowser ? logger.myconsole('Self browser analysis failed!'.red) : logger.myconsole('Analysis failed!'.red)
    if (!selfbrowser) {
      if (logincount < 1) {
        logincount += 1
      } else {
        logincount = 0
        return 'changeip'
      }
    }
    cache.writecache(cont, url, 'error')
    return false
  }

  isJson (obj, browser) {
    try {
      obj = JSON.parse(obj)
      if (!JSON.parse(obj.data.apiStack[0].value).delivery.postage) {
        logger.myconsole('Postage is missing'.red)
      }
      let isjsonstr = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
      if (isjsonstr) {
        let verifystrLogin = JSON.stringify(obj).indexOf('h5api.m.taobao.com:443//h5/mtop.taobao.detail.getdetail')
        if (verifystrLogin !== -1) {
          logger.myconsole('Slide verification code!'.red)
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
}

module.exports = InitJs
