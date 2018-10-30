/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
const path = require('path')
const fs = require('fs')
const Mytime = require('../base/time')
let mytime = new Mytime()
let Delay = require('../base/delay')
let delay = new Delay()
// let gm = require('gm')
const Writefile = require('../base/writefile')
let writefile = new Writefile()

// constructor
class InitJs {
  getimg (browser, type, ctx) {
    return new Promise(async (resolve) => {
      const page = await browser.newPage()
      await page.setViewport({width: 600, height: 380})

      try {
        await page.goto(
          'https://login.taobao.com/member/login.jhtml?tpl_redirect_url=https%3A%2F%2Fwww.tmall.com%2F&style=miniall&newMini2=true')
        await page.waitForSelector('#TPL_username_1').then(async () => {
          console.log('Get login code img is working!')
          const butHandle = await page.$('#J_Static2Quick')
          await page.evaluate(body => body.click(), butHandle)
        })

        await delay.delay(1)
        let imgpath = path.join(__dirname, '../../../static/source/img/warmachine/codeimg/codeimg' + (type || '') + '.png')
        await page.screenshot({path: imgpath})

        let mygetout = setTimeout(function () {
          console.log('Auto-login timeout! Page closed!')
          page.close()
        }, 99000)

        page.on('load', async () => {
          clearTimeout(mygetout)
          await delay.delay(2)
          let imgname = 'loginstatus' + (type || '') + '.png'
          // let imgpath = path.join(__dirname, '/../static/codeimg/codeimg.png')
          let imgpath = path.join(__dirname, '../../../static/source/img/warmachine/codeimg/' + imgname)
          await page.screenshot({path: imgpath})
          await delay.delay(1)
          // update login account status
          // await this.getcurracc(imgname)
          let mypageinfor = await page.evaluate(() => {
            return {
              title: document.title || '',
              loginacc: document.getElementsByClassName('j_Username')[0].innerHTML || ''
            }
          })
          this.writeacc(mypageinfor.loginacc, type)

          console.log('Page login success!')
          await page.close()
        })
        resolve(true)
      } catch (e) {
        console.log('Get code img error!')
        resolve(false)
        await page.close()
      }
    })
  }

  writeacc (acc, type) {
    let file = path.join(__dirname, '../../../static/source/img/warmachine/loginacc/acc.txt')
    let oldobj = fs.readFileSync(file).toString()
    let str = {}
    if (oldobj) str = JSON.parse(oldobj)
    str['b' + type] = acc
    writefile.writejs(file, JSON.stringify(str))
  }

  async getcurracc (imgname) {
    // let imgurl = './static/source/img/warmachine/codeimg/' + imgname
    // let newimg = './static/source/img/warmachine/loginacc/' + imgname
    // let readStream = fs.createReadStream(imgurl)
    // gm(imgurl).crop(102, 32, 0, 0).write(newimg, function (err) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log('crop img success'.green)
    //   }
    // })
  }
}

module.exports = InitJs
