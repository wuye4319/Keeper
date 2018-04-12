/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const path = require('path')
const Logger = require('keeper-core')
let logger = new Logger()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()

// constructor
class InitJs {
  getimg (browser) {
    return new Promise(async (resolve) => {
      const page = await browser.newPage()

      try {
        await page.goto(
          'https://login.taobao.com/member/login.jhtml?tpl_redirect_url=https%3A%2F%2Fwww.tmall.com%2F&style=miniall&newMini2=true')
        await page.waitForSelector('#TPL_username_1').then(async () => {
          logger.myconsole('Get login code img is working!'.red)
          const butHandle = await page.$('#J_Static2Quick')
          await page.evaluate(body => body.click(), butHandle)
        })

        await delay.delay(1)
        let imgpath = path.join(__dirname, '/../static/codeimg/codeimg.png')
        await page.screenshot({path: imgpath})

        let mygetout = setTimeout(function () {
          logger.myconsole('Auto-login timeout! Page closed!'.magenta)
          page.close()
        }, 99000)

        page.on('load', async () => {
          clearTimeout(mygetout)
          logger.myconsole('Page login success!'.magenta)
          await delay.delay(1)
          let imgpath = path.join(__dirname, '/../static/codeimg/loginstatus.png')
          await page.screenshot({path: imgpath})
          await page.close()
        })
        resolve(true)
      } catch (e) {
        logger.myconsole('Get code img error!'.red)
        resolve(false)
      }
    })
  }
}

module.exports = InitJs
