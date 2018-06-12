/**
 * Created by nero on 2018/1/5.
 */
const Fsrules = require('../rules')
let rules = new Fsrules()

class loadconf {
  infor () {
    return rules.infor()
  }

  seoinfor () {
    return rules.seoinfor()
  }

  dev (ispub, lang) {
    return rules.dev(ispub, lang)
  }

  wrap (lang) {
    return rules.wrap(lang)
  }

  transfile (lang) {
    return rules.transfile(lang)
  }

  mypath (lang) {
    return rules.mypath(lang)
  }

  loadconfig () {
    return rules.loadconfig()
  }
}

module.exports = loadconf
