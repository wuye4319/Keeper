/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Logger = require('keeper-core')
let logger = new Logger()

// constructor
class InitJs {
  async getip (browser) {
    const page = await browser.newPage()
    await page.authenticate({username: 'superbuy', password: 'super@123'})

    await page.goto('http://httpbin.org/ip', {waitUntil: 'networkidle', networkIdleTimeout: 1000})
    // let cont = await page.content()
    // console.log(cont)

    const mypageinfor = await page.evaluate(() => {
      return {
        pre: document.getElementsByTagName('pre')[0].innerText || ''
      }
    })

    let myip = JSON.parse(mypageinfor.pre)
    logger.myconsole('ip changes to : '.green + myip.origin.red)
    await page.close()
  }
}

module.exports = InitJs
