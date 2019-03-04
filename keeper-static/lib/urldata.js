/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
const Mytime = require('../base/time')
let mytime = new Mytime()
const Delay = require('../base/delay')
let delay = new Delay()
const Fslog = require('../base/logger')
let logger = new Fslog()

// constructor
class InitJs {
  async taobao (browser, type, url, cache, process, data, cart, islast) {
    return new Promise(async (resolve) => {
      if (url.indexOf('http') === -1) {
        url = 'http://' + url
      }
      let page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36')
      await page.setViewport({width: 1000, height: 800})

      try {
        let mygetout = setTimeout(function () {
          logger.myconsole('Auto-order timeout! Page closed!')
          resolve({state: 0, cont: 'timeout'})
          page.close()
        }, 33000)

        page.on('load', async () => {
          let istmall = page.url().indexOf('detail.tmall.com/item.htm') !== -1
          let istaobao = page.url().indexOf('item.taobao.com/item.htm') !== -1
          let tmallOrder = page.url().indexOf('order/confirm_order.htm') !== -1
          let taobaoOrder = page.url().indexOf('auction/buy_now.jhtml') !== -1
          if (istmall || istaobao) {
            // shopping
            let result = await this.shopping(page, istmall, data, mygetout, cart, islast)
            resolve(result)
          } else if (page.url().indexOf('/trade/itemlist/list_bought_items.htm') !== -1) {
            // get order id
            let result
            if (islast) {
              result = await this.getmultipro(page, data, mygetout, cart)
            } else {
              result = await this.getorderinf(page, data, mygetout)
            }
            resolve(result)
          } else if (taobaoOrder || tmallOrder) {
            // confirm order
            page.waitForSelector('.go-btn').then(async () => {
              const butHandle = await page.$('.go-btn')
              // await inputElement.click()
              await page.evaluate(target => { target.click() }, butHandle)
              await butHandle.dispose()
            }).catch(() => {
              logger.myconsole('confirm order is error')
            })
          } else if (page.url().indexOf('alipay.com') !== -1) {
            // goto user center
            page.goto('https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?tabCode=waitPay')
          } else if (page.url().indexOf('taobao.com/cart.htm') !== -1) {
            // buy cart
            const mycartnumbHandle = await page.$('.switch-cart-0')
            let mycartnumb = await mycartnumbHandle.$eval('.number', node => node.innerText)
            if (parseInt(mycartnumb) === cart) {
              const allHandle = await page.$('#J_SelectAllCbx1')
              await page.evaluate(buy => { buy.click() }, allHandle)
              await allHandle.dispose()
              await delay.delay(2)
              const buyHandle = await page.$('.btn-area a')
              await page.evaluate(buy => { buy.click() }, buyHandle)
              await buyHandle.dispose()
            }
            await mycartnumbHandle.dispose()
          }
        })

        await page.goto(url)
      } catch (e) {
        resolve({state: 0, cont: 'page error'})
        logger.myconsole('Cont page error! Or page timeout!')
        await page.close()
      }
    })
  }

  async shopping (page, istmall, data, mygetout, cart, islast) {
    return new Promise(async (resolve) => {
      // tmall or taobao product
      let select = istmall ? '.tm-promo-price .tm-price' : '.tb-promo-price .tb-rmb-num'
      page.waitForSelector(select).then(async () => {
        let res = await this.buypro(select, page, istmall, data, mygetout, cart, islast)
        resolve(res)
      }).catch((e) => {
        let select = istmall ? '.tm-price' : '.tb-rmb-num'
        page.waitForSelector(select).then(async () => {
          let res = await this.buypro(select, page, istmall, data, mygetout, cart, islast)
          resolve(res)
        }).catch((e) => {
          resolve('shopping faild : ' + e)
        })
      })
    })
  }

  async buypro (select, page, istmall, data, mygetout, cart, islast) {
    return new Promise(async (resolve) => {
      logger.myconsole(select)
      let temp = {}
      let parent = istmall ? '.tm-fcs-panel' : '.tb-promo-meta'
      let val = data.goodsPropList
      for (let i in val) {
        // choose type
        const liaHandle = await page.$('li[data-value="' + val[i].propId + ':' + val[i].valueId + '"] a')
        // await inputElement.click()
        await page.evaluate((lia, istmall) => {
          let hasSelect = istmall ? lia.parentNode.className !== 'tb-selected' : lia.className !== 'tb-selected'
          if (hasSelect) {
            lia.click()
          }
        }, liaHandle, istmall)
        await liaHandle.dispose()
      }
      // number
      let count = istmall ? '.mui-amount-input' : '#J_IptAmount'
      const countHandle = await page.$(count)
      await countHandle.press('Delete')
      await countHandle.type(data.count.toString())

      await delay.delay(1)
      // get price
      const orderHandle = await page.$(parent)
      let price = await orderHandle.$eval(select, node => node.innerText)
      // logger.myconsole(parseFloat(price), cart)
      if (parseFloat(price) <= data.unitPrice) {
        if (cart) {
          // add cart
          let addcart = istmall ? '#J_LinkBasket' : '.J_LinkAdd'
          const cartHandle = await page.$(addcart)
          await page.evaluate(buy => { buy.click() }, cartHandle)
          await cartHandle.dispose()
          await delay.delay(2)
          if (islast) {
            await page.goto('https://cart.taobao.com/cart.htm')
          } else {
            clearTimeout(mygetout)
            resolve(true)
            page.close()
          }
        } else {
          // click buy button
          let buyselect = istmall ? '#J_LinkBuy' : '.J_LinkBuy'
          const buyHandle = await page.$(buyselect)
          await page.evaluate(buy => { buy.click() }, buyHandle)
          await buyHandle.dispose()
        }
      } else {
        temp.state = 0
        temp.cont = 'price less'
        resolve(temp)
        page.close()
      }
      await orderHandle.dispose()
    })
  }

  async getorderinf (page, data, mygetout) {
    return new Promise(async (resolve) => {
      // get order infor
      let temp = {}
      page.waitForSelector('.js-order-container').then(async () => {
        const orderHandle = await page.$('.bought-wrapper-mod__head-info-cell___29cDO>span')
        let myorder = await orderHandle.$eval('span:nth-child(3)', node => node.innerText)
        await orderHandle.dispose()
        // product title
        const titleHandle = await page.$('.suborder-mod__production___3WebF p a')
        let mytitle = await titleHandle.$eval('span:nth-child(2)', node => node.innerText)
        await titleHandle.dispose()

        const priceHandle = await page.$('.js-order-container')
        let myprice = await priceHandle.$eval('.bought-wrapper-mod__head___2vnqo',
          node => document.getElementsByClassName('price-mod__price___157jz')[1].getElementsByTagName('span')[1].innerText)
        await priceHandle.dispose()
        const PostageHandle = await page.$('.js-order-container')
        let mypostage = await PostageHandle.$eval('.bought-wrapper-mod__head___2vnqo',
          node => document.getElementsByClassName('price-mod__price___157jz')[1].nextSibling.getElementsByTagName('span')[1].innerText)
        await PostageHandle.dispose()

        if (mytitle === data.goodsName) {
          temp.state = 1
          temp.order = myorder
          temp.price = myprice
          temp.postage = mypostage
        } else {
          temp.state = 0
          temp.cont = 'data anomaly'
        }
        return resolve(temp)
        clearTimeout(mygetout)
        page.close()
      }).catch(() => {
        logger.myconsole('get order infor error')
      })
    })
  }

  async getmultipro (page, data, mygetout, cart) {
    return new Promise(async (resolve) => {
      // get order infor
      let temp = {}
      page.waitForSelector('.js-order-container').then(async () => {
        const orderHandle = await page.$('.bought-wrapper-mod__head-info-cell___29cDO>span')
        let myorder = await orderHandle.$eval('span:nth-child(3)', node => node.innerText)
        await orderHandle.dispose()
        // product title
        const titleHandle = await page.$('.js-order-container')
        let mypronumb = await titleHandle.$eval('.bought-wrapper-mod__head___2vnqo', node => node.nextSibling.childNodes.length)
        await titleHandle.dispose()

        const priceHandle = await page.$('.js-order-container')
        let myprice = await priceHandle.$eval('.bought-wrapper-mod__head___2vnqo',
          node => document.getElementsByClassName('price-mod__price___157jz')[1].getElementsByTagName('span')[1].innerText)
        await priceHandle.dispose()
        const PostageHandle = await page.$('.js-order-container')
        let mypostage = await PostageHandle.$eval('.bought-wrapper-mod__head___2vnqo',
          node => document.getElementsByClassName('price-mod__price___157jz')[1].nextSibling.getElementsByTagName('span')[1].innerText)
        await PostageHandle.dispose()

        if (parseInt(mypronumb) === cart) {
          temp.state = 1
          temp.order = myorder
          temp.price = myprice
          temp.postage = mypostage
        } else {
          temp.state = 0
          temp.cont = 'data anomaly'
        }
        return resolve(temp)
        clearTimeout(mygetout)
        page.close()
      }).catch(() => {
        logger.myconsole('get order infor error')
      })
    })
  }
}

module.exports = InitJs
