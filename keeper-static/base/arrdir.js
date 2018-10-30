/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
class arrdir {
  // search all dir from dir path
  arrdir (longdir) {
    let arrdir = [longdir]
    while (longdir) {
      if (longdir === './' || longdir.length < 5) {
        longdir = false
        break
      } else {
        longdir = longdir.substring(0, longdir.lastIndexOf('/'))
        longdir = longdir.substring(0, longdir.lastIndexOf('/') + 1)
        longdir === './' || arrdir.push(longdir)
      }
    }
    return arrdir
  }
}

module.exports = arrdir
