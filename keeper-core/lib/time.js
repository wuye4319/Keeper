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

  mytime () {
    let date = this.getdate()

    let myseconds = ':' + this.bezero(date.getSeconds())
    let myhours = ' ' + this.bezero(date.getHours())
    let myminutes = ':' + this.bezero(date.getMinutes())
    let datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + myhours + myminutes + myseconds

    return datestr
  }

  mydate () {
    let date = this.getdate()

    let datestr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

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
