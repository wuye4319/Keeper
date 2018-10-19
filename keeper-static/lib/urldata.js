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
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()

// constructor
class InitJs {
  async taobao (browser, type, url, opencache, process, selfbrowser) {
    return new Promise(async (resolve) => {
      let cont = ''
      let isali = false // page from ali
      let istmall = false
      // let cookiebox = []
      let mylogstr = {}
      let page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')
      let proid = url.substr(url.lastIndexOf('?') + 1)

      try {
        let waitcont = async (index) => {
          index += 1
          if (index > 60) {
            cont = 'Failed'
            resolve(cont)
            logger.myconsole('Wait cont failed!')
          }

          if (!cont) {
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index)
            }, 100)
          } else {
            isali = true
            let data
            cont += data
            let isdata = (data && data !== 'Analysis failed!' && data !== 'changeip' && data !== 'Product is missing!')
            if (opencache && isdata) cache.writecache(cont, url, type)
            isdata ? mylogstr.apidata = 'success' : mylogstr.apidata = 'Failed'
            resolve(cont)
          }
        }

        // await page.setRequestInterception(true)
        // page.on('request', async result => {
        //     result.continue()
        // })
        // https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=%22itemNumId%22%3A%22575496041894%22%2C%22
        page.on('response', async (result) => {
          if (!isali) {
            if (result.url().indexOf(proid) !== -1) {
              try {
                cont += await result.text()
                istmall = result.url().indexOf('detail.tmall.com/item.htm?') !== -1
                await waitcont(0)
              } catch (e) {
                logger.myconsole(e + ' ' + process)
                logger.myconsole(result.url().yellow)
                if (e.toString().indexOf('Protocol error') !== -1) {
                  resolve('Analysis failed!')
                  logger.myconsole('Cont analysis failed!')
                }
              }
            }
          }
        })

        await page.goto(url)
        // let cont = await page.content()
        // close page when analysis is done
        await page.close()
        if (!isali) {
          selfbrowser ? logger.myconsole('Self browser cont is missing! ' + process) : logger.myconsole('Cont is missing! ' +
            process)
          resolve('Cont is missing!')
        }
        mylogstr.date = mytime.mytime()
        mylogstr.url = url
        // write date
        logger.mybuffer(mylogstr)
        logger.writelog('success', type)
      } catch (e) {
        resolve(false)
        logger.myconsole('Cont page error! Or page timeout!')
        await page.close()
      }
    })
  }
}

module.exports = InitJs
