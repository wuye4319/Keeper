/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const path = require('path')
const fs = require('fs')
const Logger = require('keeper-core')
let logger = new Logger()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()

// constructor
class InitJs {
  getTaocode(browser, type) {
    return new Promise(async (resolve) => {
      const page = await browser.newPage()

      try {
        let url = 'https://pub.alimama.com/openapi/param2/1/gateway.unionpub/shareitem.json?&shareUserType=1&unionBizCode=union_pub&shareSceneCode=item_realtime&materialId=585319218965&tkClickSceneCode=qtz_pub_search&siteId=1388600428&adzoneId=110143950012&needQueryQtz=true'
        await page.goto(url, { referer: 'https://pub.alimama.com/promo/search/index.htm' })
        await page.waitForSelector('#TPL_username_1').then(async () => {
          logger.myconsole('Get login code img is working!'.red)
          const butHandle = await page.$('#J_Static2Quick')
          await page.evaluate(body => body.click(), butHandle)
        })

        let mygetout = setTimeout(function () {
          logger.myconsole('Page loading timeout! Page closed!'.magenta)
          page.close()
        }, 99000)

        page.on('load', async () => {
          clearTimeout(mygetout)
          await delay.delay(2)
          // update login account status
          // await this.getcurracc(imgname)
          let mypageinfor = await page.evaluate(() => {
            return {
              title: document.title || '',
              body: document.body
            }
          })
          console.log(mypageinfor)

          logger.myconsole('Page loading success!'.magenta)
          // await page.close()
        })
        resolve(true)
      } catch (e) {
        logger.myconsole('Get tao code failed!'.red)
        resolve(false)
        // await page.close()
      }
    })
  }
}

module.exports = InitJs
