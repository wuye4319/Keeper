/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Fscompile = require('../lib/compile')
let compile = new Fscompile()
const Createshop = require('../lib/ctrl/createshop')
let createshop = new Createshop()

// constructor
class InitJs {
  async builder (type, url) {
    let cache = true
    let result = await compile.pub(type, url)

    return result
  }

  async wrap () {
    await compile.wrap('pub')
  }

  async createshop (user) {
    return await createshop.init(user)
  }
}

module.exports = InitJs
