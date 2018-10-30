/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
const Mytime = require('../base/time')
let mytime = new Mytime()
const Delay = require('../base/delay')
let delay = new Delay()

// constructor
class InitJs {
  async clear (browser) {
    return new Promise(async (resolve) => {
      let page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')
      await page.setViewport({width: 1000, height: 800})

      try {
        let mygetout = setTimeout(function () {
          console.log('Auto clear cart timeout! Page closed!')
          resolve(false)
          page.close()
        }, 61000)

        page.on('load', async () => {
          if (page.url().indexOf('taobao.com/cart.htm') !== -1) {
            // J_MiniCartNum
            const orderHandle = await page.$('#mc-menu-hd')
            let mycartnumb = await orderHandle.$eval('#J_MiniCartNum', node => node.innerText)
            await orderHandle.dispose()
            if (parseInt(mycartnumb) === 0) {
              clearTimeout(mygetout)
              resolve(true)
              page.close()
            } else {
              page.waitForSelector('#J_OrderList').then(async () => {
                const allHandle = await page.$('#J_SelectAllCbx1')
                await page.evaluate(buy => { buy.click() }, allHandle)
                await allHandle.dispose()
                const deleteHandle = await page.$('.J_DeleteSelected')
                await page.evaluate(buy => { buy.click() }, deleteHandle)
                await deleteHandle.dispose()
                const confirmHandle = await page.$('.J_DialogConfirmBtn')
                await page.evaluate(buy => { buy.click() }, confirmHandle)
                await confirmHandle.dispose()
                await delay.delay(1)
                page.reload()
              })
            }
          }
        })

        await page.goto('https://cart.taobao.com/cart.htm')
      } catch (e) {
        resolve(false)
        console.log('Clear cart page error! Or page timeout!')
        await page.close()
      }
    })
  }
}

module.exports = InitJs
