/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const Fscompile = require('../lib/compile')
let compile = new Fscompile()

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
}

module.exports = InitJs
