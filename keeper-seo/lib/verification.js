/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const koa = require('../koa/index')
const path = require('path')
const fs = require('fs')

// constructor
class InitJs {
  async login (page, loginurl, url) {
    return new Promise(async (resolve) => {
      let t = Date.now()
      let filterbox = ''
      let loginstatus
      let myurl = loginurl + encodeURIComponent(url)

      try {
        page.on('response', async (result) => {
          let filter = result.url.indexOf('initItemDetail.htm') !== -1
          let filter2 = result.url.indexOf('sib.htm') !== -1
          if (filter || filter2) {
            filterbox += await result.text()
            loginstatus = true
            console.log('Auto login success!page will close!'.green)
            resolve(filterbox)
          }
          // console.log(result.url)
        })

        await page.goto(myurl, {waitUntil: 'networkidle', networkIdleTimeout: 1000})

        await page.mainFrame().childFrames()[0].waitForSelector('#TPL_username_1').then(async () => {
          console.log('Auto login is working!'.red)

          const bodyHandle = await page.mainFrame().childFrames()[0].$('#TPL_username_1')
          const account = await page.mainFrame().childFrames()[0].evaluate(body => body.value = 'wuye4319', bodyHandle)
          console.log(account)
          await bodyHandle.dispose()
          const pswHandle = await page.mainFrame().childFrames()[0].$('#TPL_password_1')
          const psw = await page.mainFrame().childFrames()[0].evaluate(body => body.value = 'lianlian857', pswHandle)
          console.log(psw)
          await pswHandle.dispose()
          const butHandle = await page.mainFrame().childFrames()[0].$('#J_SubmitStatic')
          await page.mainFrame().childFrames()[0].evaluate(body => body.click(), butHandle)
          await butHandle.dispose()

          // const from = await page.mainFrame().childFrames()[0].evaluate(body => body.innerHTML, await page.mainFrame().childFrames()[0].$('#J_Form'))
          // console.log(from)

          page.on('load', async () => {
            if (!loginstatus) {
              console.log('Page reload! check again!'.red)
              // page.close()
              resolve(await this.reloadpage(page, url))
            }
          })
        })

        // write date
        t = Date.now() - t
        console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
      } catch (e) {
        resolve(false)
        console.log('System error!'.red)
        if (loginstatus) await page.close()
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
          console.log('Auto login success!page will close!222'.green)
        } else {
          console.log('Auto login failed!Program will stop working!!!'.red)
          resolve('System error!Program stop working!')
          koa.close()
        }
      })

      await page.goto(url, {waitUntil: 'networkidle', networkIdleTimeout: 1000})
    })
  }
}

module.exports = InitJs
