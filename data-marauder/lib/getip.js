/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Logger = require('keeper-core/logger/logger')
let logger = new Logger()
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()

// constructor
class InitJs {
  async getip (browser) {
    const page = await browser.newPage()
    await page.authenticate({username: 'superbuy', password: 'super@123'})

    await page.goto('http://httpbin.org/ip')
    // await page.goto('http://2017.ip138.com/ic.asp')
    // let cont = await page.content()
    // console.log(cont)

    const mypageinfor = await page.evaluate(() => {
      return {
        pre: document.getElementsByTagName('pre')[0].innerText || ''
      }
    })

    let myip = JSON.parse(mypageinfor.pre)
    logger.myconsole('ip changes to : '.green + myip.origin.red)
    console.log(myip.origin.red + ' >>>  ' + mytime.mytime().green)
    await page.close()
  }
}

module.exports = InitJs
