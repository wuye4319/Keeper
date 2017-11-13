/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const puppeteer = require('puppeteer')

const Taobao = require('./taobao')
let taobao = new Taobao()
const Login = require('./auto-login')
let login = new Login()
const Myseo = require('./seo')
let seo = new Myseo()

let browser

// constructor
class InitJs {
  async init () {
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
  }

  async close () {
    await browser.close()
  }

  async taobao (type, url) {
    return await taobao.taobao(browser, type, url, true)
  }

  async login (url) {
    return await login.login(browser, url)
  }

  async seo (rout, myurl, search, title) {
    return await seo.seo(browser, rout, myurl, search, title)
  }
}

module.exports = InitJs
