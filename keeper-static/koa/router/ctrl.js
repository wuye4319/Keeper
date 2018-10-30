/**
 * Created by nero on 2017/6/2.
 */
const fs = require('fs')
const Proxy = require('../../lib/proxy')
let proxy = new Proxy()

let internumb = 0
let urlbox = []

class ctrl {
  async filter (myurl, rout, data, cart, islast) {
    // filter
    console.log('process : ' + internumb.toString())
    console.log(myurl)
    let result

    if (internumb > 15) {
      console.log('Server is busy,please wait...')
      await proxy.close()
      await proxy.init()
      await proxy.initproxybrowser()
      // clear process and url box
      this.clearinternumb()
      // await proxy.autoproxy()
    } else {
      // do not cache url
      internumb += 1
      let hasurl = this.eachurl(urlbox, myurl)
      if (hasurl) {
        console.log('Repeat request!')
      } else {
        urlbox.push(myurl)
        // read cache file time
        let rct = Date.now()
        rct = Date.now() - rct
        console.log('read cache time : ' + rct.toString() + ' ms')
        result = await proxy.taobao(rout, myurl, internumb, data, cart, islast)

        // rm url in box
        urlbox.splice(hasurl - 1, 1)
        urlbox.length
          ? console.log(JSON.stringify(urlbox))
          : console.log('[]')
      }

      internumb -= 1
    }

    return result
  }

  async filtermall (ctx, rout, body) {
    let data = body.items
    let datalist = {}
    if (data.length === 1) {
      let link = data[0].originalLink
      let result = await this.filter(link, rout, data[0])
      datalist.orderNo = body.orderNo
      console.log('result : ' + JSON.stringify(result))
      datalist.itemBarcode = data[0].itemBarcode
      Object.assign(datalist, datalist, result)
      ctx.response.body = datalist
    } else if (data.length > 1) {
      datalist.orderNo = body.orderNo
      let emptycart = await proxy.clearcart()
      if (emptycart) {
        for (let i in data) {
          let link = data[i].originalLink
          let proindex = (parseInt(i) + 1)
          if (parseInt(i) === data.length - 1) {
            // buy
            let result = await this.filter(link, rout, data[i], proindex, true)
            Object.assign(datalist, datalist, result)
          } else {
            let result = await this.filter(link, rout, data[i], proindex)
            console.log('result : ' + JSON.stringify(result))
            if (!result) {
              break
            }
          }
        }
        ctx.response.body = datalist
      } else {
        ctx.response.body = 'clear cart error'
      }
    } else {
      ctx.response.body = 'mission is empty!'
    }
  }

  async slidelock (ctx, rout) {
    let myurl = ctx.url.substr(rout.length + 2)
    let result = await proxy.autoslide(myurl)
    if (result) {
      ctx.response.body = result
    } else {
      ctx.response.body = 'Get data failed!'
    }
  }

  eachurl (box, url) {
    let result = false
    for (let i in box) {
      if (box[i] === url) result = i + 1
    }
    return result
  }

  clearinternumb () {
    internumb = 0
    urlbox = []
  }

  /**
   * proxy ctrl
   * 0 close, 1 open, 2 changeip, 3 auto proxy, 4 manual chang ip
   */
  async ctrlproxy (ctx, type) {
    switch (type) {
      case '0':
        proxy.closeproxy()
        break
      case '1':
        proxy.openproxy()
        break
      case '2':
        await proxy.manualchangeip()
        break
    }

    ctx.response.body = 'success'
  }

  /**
   * auto proxy
   * 0 close, 1 open
   */
  async autoproxy (ctx, type) {
    switch (type) {
      case '0':
        proxy.manualchangeip()
        break
      case '1':
        proxy.autoproxy()
        break
    }

    ctx.response.body = 'success'
  }

  nextbrowser (ctx) {
    proxy.changebrowser()
    ctx.response.body = 'success'
  }

  // login
  async loginbycode (ctx, browsertype, index) {
    if (browsertype) {
      let result = await proxy.loginbycode(browsertype, index)
      let rand = Math.ceil(Math.random() * 1000000000)
      if (result) {
        ctx.response.body = 'codeimg' + browsertype + (index || '') + '.png'
      } else {
        ctx.response.body = 'error'
      }
    } else {
      ctx.response.body = 'Please choose browser, use key [self] or [curr]'
    }
  }

  async loginstatus (ctx, browser) {
    let rand = Math.ceil(Math.random() * 1000000000)
    browser = browser || ''
    let imgpath = path.join(__dirname, '../../../../static/source/img/warmachine/codeimg/loginstatus' + browser + '.png')
    let status = fs.statSync(imgpath)
    let labimg = '<img src="/source/img/warmachine/codeimg/loginstatus' + browser + '.png?' + rand + '" />'
    let labp = '<p>' + status.mtime + '</p>'
    ctx.response.body = labimg + labp
  }

  async weblogger (ctx) {
    // let startdate = logger.startdate()
    let logname = logger.getweblog()
    let fslog = './weblog/' + logname + '.txt'
    // fs.watchFile(fslog, (curr, prev) => {
    let txt = fs.readFileSync(fslog).toString()
    // console.log(`the current mtime is: ${curr.mtime}`)
    // console.log(`the previous mtime was: ${prev.mtime}`)
    // })
    ctx.response.body = txt
  }
}

module.exports = ctrl
