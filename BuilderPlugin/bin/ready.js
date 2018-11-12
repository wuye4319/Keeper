/**
 * Created by nero on 2017/6/29.
 * ready
 */
const Initnpm = require('keeper-core/lib/npm')
let mynpm = new Initnpm()

class ready {
  boot (plugname) {
    let pluginlist = [
      {name: 'keeper-core', ver: '1.0.60'},
      {name: 'koa', ver: '2.3.0'},
      {name: 'koa-cors', ver: '0.0.16'},
      {name: 'koa-body', ver: '4.0.4'},
      {name: 'koa-router', ver: '7.2.1'},
      {name: 'mime', ver: '2.3.1'},
      {name: 'mysql', ver: '2.13.0'},
      {name: 'xlsx', ver: '0.11.13'},
      {name: 'request', ver: '2.83.0'}
    ]
    mynpm.init(pluginlist, plugname)
  }
}

module.exports = ready
