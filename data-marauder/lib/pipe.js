/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'

const Fslog = require('keeper-core')
let logger = new Fslog()

const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()

// constructor
class InitJs {
  async getdata (browser, type, url, rules, process, selfbrowser) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let cont = {cont: '', apidata: '', status: false}
      let intercept = false // de-duplication
      // let cookiebox = []
      let mylogstr = {}
      let page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')
      let proid = url.substr(url.lastIndexOf('/'))
      logger.myconsole(mytime.mytime())

      try {
        let waitcont = async (index) => {
          index += 1
          if (index > 60) {
            cont.cont = 'Wait cont failed!'
            logger.myconsole('Wait cont failed!'.red)
          }

          if (!cont.cont) {
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index)
            }, 100)
          } else {
            logger.myconsole((selfbrowser ? 'Backup service!'.red : 'Web page!'.green) + process)
            cont.status = 'success'
            resolve(cont)
            t = Date.now() - t
            mylogstr.Loadingtime = (t / 1000).toString() + ' s'
            logger.myconsole('Loading time : '.green + mylogstr.Loadingtime.red)
          }
        }

        // await page.setRequestInterception(true)
        // page.on('request', intercep => { intercep.continue() })
        page.on('response', async (result) => {
          // console.log(result.url().green)
          // fn(result)
          if (!intercept) {
            if (result.url().indexOf(proid) !== -1) {
              try {
                cont.cont += await result.text()
                if (!rules) {
                  intercept = true
                  waitcont(0)
                }
              } catch (e) {
                logger.myconsole(e + ' ' + process)
                logger.myconsole(result.url())
                if (e.toString().indexOf('Protocol error') !== -1) {
                  resolve('Cont analysis failed!')
                  logger.myconsole('Cont analysis failed!'.red)
                }
              }
            }

            let filter = this.interceptbox(result, rules)
            if (filter) {
              try {
                cont.apidata = await result.text()
              } catch (e) {
                cont.status = 'Analysis failed!'
                resolve(cont)
                logger.myconsole('Get filter failed!'.red + process + e)
              }

              // filterbox = await http.getcode(result.url(), url)
              if (cont.apidata) {
                intercept = true
                waitcont(0)
              }
            }
          }
        })

        await page.goto(url)
        // let cont = await page.content()
        // console.log(filterbox)
        // close page when analysis is done
        await page.close()
        if (!intercept) {
          selfbrowser ? logger.myconsole('Self browser product is missing! '.yellow + process) : logger.myconsole('Product is missing! '.yellow +
            process)
          cont.status = 'Product is missing!'
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
        if (result.url().indexOf(rules[i]) !== -1) res = true
      }
      return res
    }
  }
}

module.exports = InitJs
