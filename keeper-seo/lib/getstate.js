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
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime()
let Delay = require('keeper-core/lib/delay')
let delay = new Delay()
// let gm = require('gm')
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()

// constructor
class InitJs {
  getstate (browser, type) {
    return new Promise(async (resolve) => {
      const page = await browser.newPage()

      try {
        await page.goto('https://www.taobao.com/')
        let mygetout = setTimeout(function () {
          logger.myconsole('Page loading timeout! Page closed!'.magenta)
          page.close()
        }, 99000)

        await page.waitForSelector('.site-nav-region').then(async () => {
          clearTimeout(mygetout)
          await delay.delay(2)
          let imgname = 'state' + (type || '') + '.png'
          // let imgpath = path.join(__dirname, '/../static/codeimg/codeimg.png')
          let imgpath = './static/source/img/warmachine/loginacc/' + imgname
          await page.screenshot({path: imgpath})
          await delay.delay(1)
          // update login account status
          // await this.getcurracc(imgname)
          let mypageinfor = await page.evaluate(() => {
            return {
              title: document.title || '',
              loginacc: document.getElementsByClassName('site-nav-login-info-nick')[0].innerHTML || '',
              region: document.getElementsByClassName('site-nav-region')[0].innerHTML || ''
            }
          })

          logger.myconsole(mypageinfor.region)
          if (mypageinfor.region !== '中国大陆') {
            await page.mouse.move(30, 95)
            // , {button: 'right'}
            await page.mouse.click(30, 95)
            const butHandle = await page.$('.site-nav-region-item:nth-child(2)')
            await page.evaluate(body => body.click(), butHandle)
            await delay.delay(2)
            logger.myconsole('Get state success!'.magenta)
          }
          if (mypageinfor.loginacc) {
            this.writeacc(mypageinfor.loginacc, type)
          }

          await page.close()
          resolve(mypageinfor)
        })
      } catch (e) {
        logger.myconsole('Get state error!'.red)
        resolve(false)
        await page.close()
      }
    })
  }

  writeacc (acc, type) {
    let file = './static/source/img/warmachine/loginacc/acc.txt'
    let oldobj = fs.readFileSync(file).toString()
    let str = {}
    if (oldobj) str = JSON.parse(oldobj)
    str['b' + type] = acc
    writefile.writejs(file, JSON.stringify(str))
  }
}

module.exports = InitJs
