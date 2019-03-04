/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
class arrdir {
  arrdir (a) {
    let b = [a]
    for (; a;) if ('./' === a || 5 > a.length) {
      a = !1
      break
    } else a = a.substring(0, a.lastIndexOf('/')), a = a.substring(0, a.lastIndexOf('/') + 1), './' == a || b.push(a)
    return b
  }
}

module.exports = arrdir
