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
  autoslide (browser, url) {
    return new Promise(async (resolve) => {
      const page = await browser.newPage()
      console.log(url)

      try {
        await page.goto(url)
        await page.waitForSelector('#nocaptcha').then(async () => {
          logger.myconsole('Slide lock is working!'.red)
        })

        await page.waitFor(1000)
        await page.setViewport({
          width: 1000,
          height: 900
        })
        await page.waitFor(500)
        // const butHandle = await page.$('#nc_1_n1z')
        const m = page.mouse
        await m.move(200, 350)
        await m.down()
        let step = Math.ceil(Math.random() * 30 + 20)
        await m.move(400, 450, {steps: step})
        await m.up()

        logger.myconsole('Page login success!'.magenta)
        // await page.close()
        resolve(true)
      } catch (e) {
        logger.myconsole('Slide lock error!'.red)
        resolve(false)
        await page.close()
      }
    })
  }
}

module.exports = InitJs
