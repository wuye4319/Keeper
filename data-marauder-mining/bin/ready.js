/**
 * Created by nero on 2017/6/29.
 * ready
 */
const Initnpm = require('keeper-core/lib/npm')
let mynpm = new Initnpm()

class ready {
  boot (plugname) {
    let pluginlist = [
      {name: 'keeper-core', ver: '1.1.3'}
    ]
    mynpm.init(pluginlist, plugname)
  }
}

module.exports = ready
