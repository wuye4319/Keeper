/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const koa = require('../koa/index')
const path = require('path')
const fs = require('fs')
const Logger = require('keeper-core')
let logger = new Logger()

let allowlogin = true

// constructor
class InitJs {
  async login (page, loginurl, url) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''
      let loginstatus
      let mygetout = false
      let myurl = loginurl + encodeURIComponent(url)

      if (allowlogin) {
        try {
          page.on('response', async (result) => {
            let filter = result.url.indexOf('initItemDetail.htm') !== -1
            let filter2 = result.url.indexOf('sib.htm') !== -1
            if (filter || filter2) {
              filterbox += await result.text()
              loginstatus = true
              logger.myconsole('Auto login success!'.green)
              allowlogin = true
              if (mygetout) clearTimeout(mygetout)
              resolve(filterbox)
            }
            // console.log(result.url)
          })

          page.on('load', () => {
            mygetout = setTimeout(function () {
              resolve('Auto-login failed!')
            }, 20000)
          })

          await page.goto(myurl, {waitUntil: 'networkidle', networkIdleTimeout: 1000})

          await page.mainFrame().childFrames()[0].waitForSelector('#TPL_username_1').then(async () => {
            logger.myconsole('Auto login is working!'.red)
            allowlogin = false

            const bodyHandle = await page.mainFrame().childFrames()[0].$('#TPL_username_1')
            const account = await page.mainFrame().childFrames()[0].evaluate(body => body.value = '捣腾捣腾003', bodyHandle)
            logger.myconsole(account)
            await bodyHandle.dispose()
            const pswHandle = await page.mainFrame().childFrames()[0].$('#TPL_password_1')
            const psw = await page.mainFrame().childFrames()[0].evaluate(body => body.value = 'ddt@1233', pswHandle)
            logger.myconsole(psw)
            await pswHandle.dispose()
            const butHandle = await page.mainFrame().childFrames()[0].$('#J_SubmitStatic')
            await page.mainFrame().childFrames()[0].evaluate(body => body.click(), butHandle)
            await butHandle.dispose()

            // const from = await page.mainFrame().childFrames()[0].evaluate(body => body.innerHTML, await page.mainFrame().childFrames()[0].$('#J_Form'))
            // console.log(from)

            page.on('load', async () => {
              if (!loginstatus) {
                logger.myconsole('Page reload! check again!'.red)
                // page.close()
                resolve(await this.reloadpage(page, url))
              }
            })

            t = Date.now() - t
            logger.myconsole('Loading time : '.green + (t / 1000).toString() + ' seconds'.green)
          })
        } catch (e) {
          resolve(false)
          logger.myconsole('System error!'.red)
        }
      } else {
        logger.myconsole('Auto-login is working!'.red)
        resolve(false)
      }
    })
  }

  async reloadpage (page, url) {
    return new Promise(async (resolve) => {
      let filterbox = ''
      let loginstatus

      page.on('response', async (result) => {
        let filter = result.url.indexOf('initItemDetail.htm') !== -1
        let filter2 = result.url.indexOf('sib.htm') !== -1
        if (filter || filter2) {
          filterbox += await result.text()
          loginstatus = true
          resolve(filterbox)
        }
        // console.log(result.url)
      })

      page.on('load', async () => {
        if (loginstatus) {
          logger.myconsole('Auto login success!page will close!222'.green)
        } else {
          logger.myconsole('Auto login failed!Program will stop working!!!'.red)
          resolve('Auto-login failed!')
          koa.close()
        }
      })

      await page.goto(url, {waitUntil: 'networkidle', networkIdleTimeout: 1000})
    })
  }
}

module.exports = InitJs
