/**
 * Created by nero on 2017/10/16.
 * get current time
 */
const os = require('os')

class time {
  constructor () {
    this.options = {
      adjust: false
    }
  }

  getdate () {
    let date = new Date()
    if (os.platform() === 'linux' && this.options.adjust) {
      date.setHours(date.getHours() + 13)
    }
    return date
  }

  dateispass (datearr, keepdate) {
    let ruletime = this.getdate()
    ruletime.setMinutes(ruletime.getMinutes() - keepdate)
    ruletime = ruletime.getTime()

    let date = this.getdate()
    date.setYear(datearr[0])
    date.setMonth(datearr[1] - 1)
    date.setDate(datearr[2])
    date.setHours(datearr[3])
    date.setMinutes(datearr[4])
    date.setSeconds(0)
    date = date.getTime()

    if (date < ruletime) {
      return true
    } else {
      return false
    }
  }

  mytime () {
    let date = this.getdate()

    let myseconds = ':' + this.bezero(date.getSeconds())
    let myhours = ' ' + this.bezero(date.getHours())
    let myminutes = ':' + this.bezero(date.getMinutes())
    let datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + myhours + myminutes + myseconds

    return datestr
  }

  mydate (unit) {
    let date = this.getdate()
    let datestr
    if (unit === 'mins') {
      datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes()
    } else {
      datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }

    return datestr
  }

  bezero (time) {
    if (time === 0) {
      return '00'
    } else if (time < 10) {
      return '0' + time
    } else {
      return time
    }
  }
}

module.exports = time
