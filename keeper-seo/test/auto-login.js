/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const koa = require('../koa/index')
const Logger = require('keeper-core')
let logger = new Logger()

// constructor
class InitJs {
  async login (page, loginurl, url) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''
      let mygetout = false
      let myurl = loginurl + encodeURIComponent(url)
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')

      try {
        page.on('response', async (result) => {
          let filter = result.url().indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url().indexOf('sib.htm') !== -1
          if (filter || filter2) {
            filterbox += await result.text()
            if (mygetout) clearTimeout(mygetout)
            logger.myconsole('Auto login success!'.green)
            resolve(filterbox)
          }
          // console.log(result.url)
        })

        page.on('load', () => {
          mygetout = setTimeout(function () {
            let str = 'Auto-login timeout! Login failed!'
            filterbox || logger.myconsole(str.red)
            resolve(str)
          }, 20000)
        })

        await page.goto(myurl)

        await page.mainFrame().waitForSelector('#TPL_username_1').then(async () => {
          logger.myconsole('Auto login is working!'.red)

          const bodyHandle = await page.mainFrame().$('#TPL_username_1')
          const account = await page.mainFrame().evaluate(body => body.value = '18018748974', bodyHandle)
          logger.myconsole(account)
          await bodyHandle.dispose()
          const pswHandle = await page.mainFrame().$('#TPL_password_1')
          const psw = await page.mainFrame().evaluate(body => body.value = 'asd123456@', pswHandle)
          logger.myconsole(psw)
          await pswHandle.dispose()
          const butHandle = await page.mainFrame().$('#J_SubmitStatic')
          await page.mainFrame().evaluate(body => body.click(), butHandle)
          await butHandle.dispose()

          t = Date.now() - t
          logger.myconsole('Loading time : '.green + (t / 1000).toString() + ' seconds'.green)
        })
      } catch (e) {
        resolve(false)
        logger.myconsole('Login system error!'.red)
      }
    })
  }
}

module.exports = InitJs
