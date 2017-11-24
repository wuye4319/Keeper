/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

const Taobao = require('./taobao')
let taobao = new Taobao()
const Myseo = require('./seo')
let seo = new Myseo()
const Render = require('keeper-core/lib/render')
let render = new Render()
const accbox = require('../config/account')

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
    browser.close()
  }

  async taobao (type, url) {
    let cache = true
    let data = await taobao.taobao(browser, type, url, cache)
    return data
  }

  async login (loginurl, url, account) {
    const page = await browser.newPage()

    let file = path.join(__dirname, '/../tpl/acc.js')
    const tpl = fs.readFileSync(file).toString()
    let param = {
      acc: accbox[account].acc,
      psw: accbox[account].psw
    }
    let mystr = render.renderdata(tpl, param)

    const Login = eval(mystr)
    let login = new Login()

    let data = await login.login(page, loginurl, url, account)
    return data
  }

  async seo (rout, myurl, search, title) {
    let data = await seo.seo(browser, rout, myurl, search, title)
    return data
  }
}

module.exports = InitJs
