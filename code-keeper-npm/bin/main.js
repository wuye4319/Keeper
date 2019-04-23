#!/usr/bin/env node
/**
 * Created by nero on 2016/5/29.
 * ready
 */

require('colors')
const Infor = require('keeper-core/lib/infor')
let infor = new Infor()
const readyconfig = require('./ready')

const path = require('path')
let pwd = path.dirname(__dirname)
let plugname=path.basename(pwd)
// let plugname = pwd.substr(pwd.lastIndexOf('/') + 1)

infor.boot(plugname, readyconfig, () => {
  const program = require('./loader')
  if (program.force) infor.bootstrap(plugname, readyconfig)
})
