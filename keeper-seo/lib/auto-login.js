/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
let seoinfor = require('../config/seoinfor')

const Render = require('keeper-core/lib/render')
let render = new Render()
const Fscache = require('keeper-core/cache/cache')
const cache = new Fscache()
const Fslog = require('keeper-core')
let log = new Fslog()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()

// constructor
class InitJs {
  async login (browser, url) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''

      try {
        const page = await browser.newPage()
        // await page.setRequestInterceptionEnabled(true)
        page.on('response', async (result) => {
          let filter = result.url.indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url.indexOf('sib.htm') !== -1
          if (filter || filter2) {
            filterbox += await result.text()
            // await page.cookies(result.url)
            console.log('login success!page will close!'.green)
            await page.close()
            resolve(filterbox)
          }
          // console.log(result.url)
        })

        await page.goto(url, {waitUntil: 'networkidle', networkIdleTimeout: 1000})
        // let cont = await page.content()
        // console.log(cont)

        await page.mainFrame().childFrames()[0].waitForSelector('#TPL_username_1').then(async () => {
          const bodyHandle = await page.mainFrame().childFrames()[0].$('#TPL_username_1')
          const account = await page.mainFrame().childFrames()[0].evaluate(body => body.value = 'wuye4319', bodyHandle)
          console.log(account)
          await bodyHandle.dispose()
          const pswHandle = await page.mainFrame().childFrames()[0].$('#TPL_password_1')
          const psw = await page.mainFrame().childFrames()[0].evaluate(body => body.value = 'lianlian857', pswHandle)
          console.log(psw)
          await pswHandle.dispose()
          const butHandle = await page.mainFrame().childFrames()[0].$('#J_SubmitStatic')
          const butt = await page.mainFrame().childFrames()[0].evaluate(body => body.click(), butHandle)
          console.log(butt)
          await butHandle.dispose()

          // const from = await page.mainFrame().childFrames()[0].evaluate(body => body.innerHTML, await page.mainFrame().childFrames()[0].$('#J_Form'))
          // console.log(from)
        })

        // write date
        t = Date.now() - t
        // let str = '{"Loadingtime":"' + (t / 1000).toString() + 's","date":"' + mytime.mytime() + '","url":"' + url + '",'
        // log.writelog('success', str + '"title":"' + mypageinfor.title + '"}', type)
        console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
      } catch (e) {
        resolve(false)
        console.log('System error!'.red)
        await page.close()
      }
    })
  }
}

module.exports = InitJs
