const path = require('path'), fs = require('fs'), Logger = require('keeper-core')
let logger = new Logger
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime, Delay = require('keeper-core/lib/delay'), delay = new Delay
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile

class InitJs {
  getimg (a, b) {
    return new Promise(async c => {
      const d = await a.newPage()
      try {
        await d.goto(
          'https://login.taobao.com/member/login.jhtml?tpl_redirect_url=https%3A%2F%2Fwww.tmall.com%2F&style=miniall&newMini2=true'), await d.waitForSelector(
          '#TPL_username_1').then(async () => {
          logger.myconsole('Get login code img is working!'.red)
          const h = await d.$('#J_Static2Quick')
          await d.evaluate(i => i.click(), h)
        }), await delay.delay(1)
        await d.screenshot({path: './static/source/img/warmachine/codeimg/codeimg' + (b || '') + '.png'})
        let g = setTimeout(function () {logger.myconsole('Auto-login timeout! Page closed!'.magenta), d.close()}, 99000)
        d.on('load', async () => {
          clearTimeout(g), await delay.delay(2)
          await d.screenshot({path: './static/source/img/warmachine/codeimg/' + ('loginstatus' + (b || '') + '.png')}), await delay.delay(1)
          let j = await d.evaluate(
            () => {return {title: document.title || '', loginacc: document.getElementsByClassName('j_Username')[0].innerHTML || ''}})
          this.writeacc(j.loginacc, b), logger.myconsole('Page login success!'.magenta), await d.close()
        }), c(!0)
      } catch (f) {logger.myconsole('Get code img error!'.red), c(!1), await d.close()}
    })
  }

  writeacc (a, b) {
    let c = './static/source/img/warmachine/loginacc/acc.txt', d = fs.readFileSync(c).toString(), f = {}
    d && (f = JSON.parse(d)), f['b' + b] = a, writefile.writejs(c, JSON.stringify(f))
  }

  async getcurracc () {}
}

module.exports = InitJs
