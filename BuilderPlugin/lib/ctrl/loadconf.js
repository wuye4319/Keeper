/**
 * Created by nero on 2018/1/5.
 * This file use for prevent loading rules repeat
 * This file makes rules can new function in anywhere
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

  dev (ispub, lang, user) {
    return rules.dev(ispub, lang, user)
  }

  wrap (lang, user) {
    return rules.wrap(lang, user)
  }

  createshop (lang, user) {
    return rules.createshop(lang, user)
  }

  transfile (lang) {
    return rules.transfile(lang)
  }

  mypath (lang) {
    return rules.mypath(lang)
  }

  loadconfig (url) {
    return rules.loadconfig(url)
  }
}

module.exports = loadconf
