/**
 * Created by nero on 2017/6/29.
 * ready
 */
const Initnpm = require('keeper-core/lib/npm')
let mynpm = new Initnpm()

class ready {
  boot () {
    let pluginlist = [
      {name: 'keeper-core', ver: '1.0.39'},
      {name: 'koa', ver: '2.3.0'},
      {name: 'koa-cors', ver: '0.0.16'},
      {name: 'koa-router', ver: '7.2.1'},
    ]
    mynpm.init(pluginlist, 'keeper-count')
  }
}

module.exports = ready
