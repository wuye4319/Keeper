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
// const SlideLock = require('./slidelock')
// let slidelock = new SlideLock()
const Tmall = require('../work/tmall')
let tmall = new Tmall()
const Taobao = require('../work/taobao')
let taobao = new Taobao()

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
            logger.myconsole('Wait cont failed!'.red)
          }

          if (!cont) {
            setTimeout(function () {
              // logger.myconsole(index + ' p:' + process)
              waitcont(index)
            }, 100)
          } else {
            isali = true
            let data
            if (istmall) {
              let myurl = 'https://detail.m.tmall.com/item.htm?' + proid
              data = await tmall.tmall(browser, type, myurl, true, process, selfbrowser)
            } else {
              let tempid = proid.substr(proid.indexOf('=') + 1)
              let myurl = 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=itemNumId%22%3A%22' + tempid + '%2C'
              data = await taobao.taobao(browser, type, myurl, true, process, selfbrowser)
            }
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
              }
            }
          }
        })

        await page.goto(url)
        // let cont = await page.content()
        // close page when analysis is done
        await page.close()
        if (!isali) {
          selfbrowser ? logger.myconsole('Self browser cont is missing! '.yellow + process) : logger.myconsole('Cont is missing! '.yellow +
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
        logger.myconsole('Cont page error! Or page timeout!'.red)
        await page.close()
      }
    })
  }
}

module.exports = InitJs
