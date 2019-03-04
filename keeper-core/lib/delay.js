/**
 * Created by nero on 2017/6/30.
 * delay
 */

class delay {
  constructor () {
    this.options = {
      stream: process.stdout
    }
  }

  async delay (second, log) {
    await this.timer(second, log)
  }

  timer (count, log) {
    return new Promise((resolve) => {
      let self = this
      const sth = function () {
        if (log) {
          self.options.stream.clearLine()
          self.options.stream.cursorTo(0)
          count === 0 ? console.log('Count down : ' + count) : self.options.stream.write('Count down : ' + count.toString())
        }
        count--
        if (count >= 0) {
          setTimeout(function () {
            sth()
          }, 1000)
        } else {
          !log || console.log('rest is over!'.blue)
          resolve()
        }
      }
      sth()
    })
  }
}

module.exports = delay
