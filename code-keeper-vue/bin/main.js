#!/usr/bin/env node
/**
 * Created by nero on 2016/5/29.
 * ready
 */

require('colors')
const Infor = require('keeper-core/lib/infor')
let infor = new Infor()
const readyconfig = require('./ready')

let plugname = 'code-keeper2'

infor.boot(plugname, readyconfig, () => {
  require('./loader')
})
