/**
 * Created by nero on 2017/10/16.
 * get current time
 */
const os = require('os')

class time {
  constructor () {this.options = {adjust: !1}}

  getdate () {
    let a = new Date
    return 'linux' === os.platform() && this.options.adjust && a.setHours(a.getHours() + 13), a
  }

  dateispass (a, b) {
    let c = this.getdate()
    c.setMinutes(c.getMinutes() - b), c = c.getTime()
    let d = this.getdate()
    return d.setYear(a[0]), d.setMonth(a[1] - 1), d.setDate(a[2]), d.setHours(a[3]), d.setMinutes(a[4]), d.setSeconds(0), d = d.getTime(), d < c
      ? 1
      : 0
  }

  mytime () {
    let a = this.getdate(), b = ':' + this.bezero(a.getSeconds()), c = ' ' + this.bezero(a.getHours()), d = ':' + this.bezero(a.getMinutes()),
      e = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + c + d + b
    return e
  }

  mydate (a) {
    let c, b = this.getdate()
    return c = 'mins' === a
      ? b.getFullYear() + '-' + (b.getMonth() + 1) + '-' + b.getDate() + '-' + b.getHours() + '-' + b.getMinutes()
      : b.getFullYear() + '-' + (b.getMonth() + 1) + '-' + b.getDate(), c
  }

  bezero (a) {return 0 === a ? '00' : 10 > a ? '0' + a : a}
}

module.exports = time