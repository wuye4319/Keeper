const Logger = require('keeper-core/logger/logger')
let logger = new Logger
const Mytime = require('keeper-core/lib/time')
let mytime = new Mytime

class InitJs {
  async getip (a) {
    const b = await a.newPage()
    await b.authenticate({username: 'superbuy', password: 'super@123'}), await b.goto('http://httpbin.org/ip')
    const c = await b.evaluate(() => {return {pre: document.getElementsByTagName('pre')[0].innerText || ''}})
    let d = JSON.parse(c.pre)
    logger.myconsole('ip changes to : '.green + d.origin.red), console.log(d.origin.red + ' >>>  ' + mytime.mytime().green), await b.close()
  }
}

module.exports = InitJs
