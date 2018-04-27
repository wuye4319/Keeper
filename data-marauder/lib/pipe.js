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
let logincount = 0
let apidata = false
const systemconfig = require('../config/system')

// constructor
class InitJs {
  async getcont (cont, filterbox, selfbrowser) {
    return new Promise(async resolve => {
      let isjson = false
      let templine = '\n<script>\nvar apidata = '
      let endtempline = '\n</script>'

      let tempstr = this.subresult(filterbox)
      if (tempstr) filterbox = tempstr
      isjson = this.isJson(filterbox)
      if (isjson && filterbox && cont) {
        apidata = true
        // if previous api is success, reduce
        if (logincount && !selfbrowser) logincount -= 1
      } else {
        let befailed = await this.befailed(filterbox, selfbrowser)
        if (befailed === 'changeip') { resolve('changeip') } else { resolve('Analysis failed!') }
      }

      cont = cont + templine + filterbox + endtempline
      resolve(cont)
    })
  }

  async getdata (browser, type, url, rules, process, selfbrowser) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let cont = ''
      let intercept = false // page from ali
      // let cookiebox = []
      let mylogstr = {}
      let page = await browser.newPage()
      apidata = false
      let proid = url.substr(url.lastIndexOf('/'))
      logger.myconsole(mytime.mytime())

      try {
        let waitcont = async (index, filterbox) => {
          index += 1
          if (index > 60) {
            cont = 'Wait cont failed!'
            logger.myconsole('Wait cont failed!'.red)
          }

          if (!cont) {
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index, filterbox)
            }, 100)
          } else {
            logger.myconsole('Web page opens normally '.green + process + (selfbrowser ? ', backup service!'.red : ''))
            cont = await this.getcont(cont, filterbox, selfbrowser)
            resolve(cont)
            t = Date.now() - t
            mylogstr.Loadingtime = (t / 1000).toString() + ' s'
            logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)

            if (systemconfig.cache && apidata && filterbox) cache.writecache(cont, url, type)
            apidata && filterbox ? mylogstr.apidata = 'success' : mylogstr.apidata = 'Failed'
          }
        }

        // await page.setRequestInterception(true)
        // page.on('request', intercep => { intercep.continue() })
        page.on('response', async (result) => {
          if (systemconfig.printsourceurl) {
            console.log(result.url().green)
          }

          // fn(result)
          if (!intercept) {
            if (result.url().indexOf(proid) !== -1) {
              console.log('11111111111111')
              try {
                cont += await result.text()
              } catch (e) {
                logger.myconsole('Get cont failed!'.red + process + e)
              }
            }

            let filter = this.interceptbox(result, rules)
            if (filter) {
              let filterbox = ''
              try {
                filterbox = await result.text()
              } catch (e) {
                resolve('Analysis failed!')
                logger.myconsole('Get filter failed!'.red + process + e)
              }

              // filterbox = await http.getcode(result.url(), url)
              if (filterbox) {
                intercept = true
                waitcont(0, filterbox)
              }
            }
          }

          // if (result.url() === url) {
          //   cont = await result.text()
          // }
        })

        await page.goto(url)
        // let cont = await page.content()
        // console.log(filterbox)
        // close page when analysis is done
        await page.close()
        if (rules) {
          if (!intercept) {
            selfbrowser ? logger.myconsole('Self browser product is missing! '.yellow + process) : logger.myconsole('Product is missing! '.yellow +
              process)
            resolve('Product is missing!')
          }
        } else {
          resolve(cont)
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

  interceptbox (result, rules) {
    let res = false
    if (rules) {
      for (let i in rules) {
        if (result.url().indexOf(rules[i]) !== -1) {
          res = true
        }
      }
    }

    return res
  }

  async befailed (filterbox, selfbrowser) {
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

    return false
  }

  isJson (obj) {
    try {
      obj = JSON.parse(obj)
      let isjsonstr = typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
      if (isjsonstr) {
        let verifystr = JSON.stringify(obj).indexOf('detailskip.taobao.com/__x5__/query.htm')
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
