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
// const SlideLock = require('./slidelock')
// let slidelock = new SlideLock()
const Tmall = require('./tmall')
let tmall = new Tmall()

let logincount = 0
let apidata = false

// constructor
class InitJs {
  async getcont (browser, cont, filterbox, selfbrowser, url) {
    return new Promise(async resolve => {
      let isjson = false
      if (cont === 'Failed') cont = false
      let templine = '\n<script>\nvar apidata = '
      let endtempline = '\n</script>'
      let splitline = '\n================================================\n'

      let tempstr = this.subresult(filterbox)
      if (tempstr) filterbox = tempstr
      isjson = this.isJson(filterbox, browser)
      if (isjson && filterbox && cont) {
        apidata = true
        // if previous api is success, reduce
        if (logincount && !selfbrowser) logincount -= 1
      } else {
        let errcont = cont + splitline + filterbox
        let befailed = await this.befailed(filterbox, selfbrowser, errcont, url)
        if (befailed === 'changeip') { resolve('changeip') } else { resolve('Analysis failed!') }
      }

      cont = cont + templine + filterbox + endtempline
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
      logger.myconsole('<p>' + mytime.mytime() + '</p>', 'web')

      try {
        let waitcont = async (index, filterbox) => {
          index += 1
          if (index > 60) {
            cont = 'Failed'
            logger.myconsole('Wait cont failed!'.red)
            logger.myconsole('<p style="color: red">Wait cont failed!</p>', 'web')
          }

          if (!cont) {
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index, filterbox)
            }, 100)
          } else {
            logger.myconsole('Web page opens normally '.green + process + (selfbrowser ? ', backup service!'.red : ''))
            logger.myconsole('<p style="color: green">Web page opens normally ' + process +
              (selfbrowser ? ', <span style="color: red">backup service!</span>' : '') + '</p>', 'web')
            cont = await this.getcont(browser, cont, filterbox, selfbrowser, url)
            resolve(cont)
            t = Date.now() - t
            mylogstr.Loadingtime = (t / 1000).toString() + ' s'
            logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)
            logger.myconsole('<p style="color: green">Loading time : <span style="color: red">' + mylogstr.Loadingtime + '</span></p>', 'web')

            if (opencache && apidata && filterbox) cache.writecache(cont, url, type)
            apidata && filterbox ? mylogstr.apidata = 'success' : mylogstr.apidata = 'Failed'
          }
        }

        // await page.setRequestInterception(true)
        // page.on('request', intercep => { intercep.continue() })
        page.on('response', async (result) => {
          if (!isali) {
            let filter = result.url().indexOf('initItemDetail.htm') !== -1
            let filter2 = result.url().indexOf('sib.htm') !== -1
            let filterbox = ''
            if (result.url().indexOf(proid) !== -1) {
              try {
                cont += await result.text()
                if (result.url().indexOf('detail.tmall.com/item.htm?') !== -1 && cont) {
                  isali = true
                  let myurl = 'https://detail.m.tmall.com' + proid
                  let tmalldata = await tmall.tmall(browser, 'tmall', myurl, true, process, selfbrowser)
                  resolve(cont + tmalldata)
                }
              } catch (e) {
                logger.myconsole(e + ' ' + process)
              }
            } else if (filter || filter2) {
              try {
                filterbox = await result.text()
                if (filterbox) {
                  isali = true
                  waitcont(0, filterbox)
                }
              } catch (e) {
                resolve('Analysis failed!')
                logger.myconsole('Get filter failed!'.red + process + e)
                logger.myconsole('<p style="color: red">Get filter failed!</p>' + process + e, 'web')
              }
              // filterbox = await http.getcode(result.url(), url)
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

  async befailed (filterbox, selfbrowser, cont, url) {
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
      if (isjsonstr) {
        let verifystr = JSON.stringify(obj).indexOf('//detailskip.taobao.com:443/service/getData/1/p1/item/detail/sib.htm')
        let verifystr2 = JSON.stringify(obj).indexOf('sec.taobao.com/query.htm?smApp')
        let verifystrLogin = JSON.stringify(obj).indexOf('login.taobao.com/member/login.jhtml?style=')
        // let slidelock = JSON.stringify(obj).indexOf('mdskip.taobao.com:443//core/initItemDetail.htm/_____tmd_____/punish')
        // console.log(verifystr2, verifystr)
        // if (slidelock !== -1) {
        //   logger.myconsole('Slide lock Verification!'.red)
        //   slidelock.autoslide(browser, obj.url)
        //   return 'slidelock'
        // } else
        if (verifystrLogin !== -1) {
          logger.myconsole('Login redirect!'.red)
          logger.myconsole('<p style="color: red">Login redirect!</p>', 'web')
          return false
        } else if (verifystr !== -1 || verifystr2 !== -1) {
          logger.myconsole('Verification Code!'.red)
          logger.myconsole('<p style="color: red">Verification Code!</p>', 'web')
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

  // checklogin (cookiebox) {
  //   let result = false
  //   for (let i in cookiebox) {
  //     let key1 = 'lgc'
  //     let key2 = 'tracknick'
  //     if (cookiebox[i].name === key1 || cookiebox[i].name === key2) {
  //       result = true
  //       break
  //     }
  //   }
  //   return result
  // }
}

module.exports = InitJs
