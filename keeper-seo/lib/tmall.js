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
      let templine = '\n<script>\nvar apidata_tmall = '
      let endtempline = '\n</script>'
      let str
      try {
        str = cont.match(/<script>var _DATA_Mdskip =  ([\s\S]+) <\/script>\s+<script src=/)[1]
      } catch (e) {
        logger.myconsole('String is error : '.red + e)
      }
      isjson = str ? this.isJson(str, browser) : false
      if (isjson && cont) {
        apidata = true
        // if previous api is success, reduce
        if (logincount && !selfbrowser) logincount -= 1
      } else {
        let befailed = await this.befailed(cont, selfbrowser, url)
        if (befailed === 'changeip') { resolve('changeip') } else { resolve('Analysis failed!') }
      }

      cont = templine + str + endtempline
      resolve(cont)
    })
  }

  async tmall (browser, type, url, opencache, process, selfbrowser) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let cont = ''
      let isali = false // page from ali
      let freepage = false
      // let cookiebox = []
      let mylogstr = {}
      let page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')
      apidata = false
      let proid = url.substr(url.lastIndexOf('/'))
      logger.myconsole(mytime.mytime())
      logger.myconsole('<p>' + mytime.mytime() + '</p>', 'web')

      try {
        let waitcont = async (index) => {
          index += 1
          if (index > 60) {
            cont = 'Failed'
            resolve(cont)
            logger.myconsole('Wait cont failed!'.red)
            logger.myconsole('<p style="color: red">Wait cont failed!</p>', 'web')
            if (freepage) page.close()
            freepage = true
          }

          if (!cont) {
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index)
            }, 100)
          } else {
            isali = true
            logger.myconsole('Web page opens normally '.green + process + (selfbrowser ? ', backup service!'.red : ''))
            logger.myconsole('<p style="color: green">Web page opens normally ' + process +
              (selfbrowser ? ', <span style="color: red">backup service!</span>' : '') + '</p>', 'web')
            cont = await this.getcont(browser, cont, selfbrowser, url)
            resolve(cont)
            t = Date.now() - t
            mylogstr.Loadingtime = (t / 1000).toString() + ' s'
            logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)
            logger.myconsole('<p style="color: green">Loading time : <span style="color: red">' + mylogstr.Loadingtime + '</span></p>', 'web')
            if (freepage) page.close()
            freepage = true
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

            if (result.url().indexOf('mdetail.tmall.com/mobile/') !== -1) {
              selfbrowser ? logger.myconsole('Self browser product is missing! '.yellow + process) : logger.myconsole('Product is missing! '.yellow +
                process)
              selfbrowser
                ? logger.myconsole('<p style="color: yellow">Self browser product is missing! </p>' + process, 'web')
                : logger.myconsole('<p style="color: yellow">Product is missing! </p>' + process, 'web')
              resolve('Product is missing!')
              page.close()
            } else if (result.url().indexOf('sec.taobao.com/query.htm') !== -1) {
              logger.myconsole('Verification Code!'.red)
              resolve('Product is missing!')
              page.close()
            }
          }
        })
        await page.goto(url)
        // let cont = await page.content()
        // console.log(filterbox)
        // close page when analysis is done
        await page.close()
        mylogstr.date = mytime.mytime()
        mylogstr.url = url
        // write date
        logger.mybuffer(mylogstr)
        logger.writelog('success', type)
        if (freepage) page.close()
        freepage = true
      } catch (e) {
        resolve(false)
        logger.myconsole('System error! Or page timeout!'.red)
        logger.myconsole('<p style="color: red">System error! Or page timeout!</p>', 'web')
        await page.close()
      }
    })
  }

  async befailed (cont, selfbrowser, url) {
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
    cache.writecache(cont, url, 'error')
    return false
  }

  isJson (obj, browser) {
    try {
      obj = JSON.parse(obj)
      let isjsonstr = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
      return isjsonstr
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
