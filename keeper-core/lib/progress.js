/**
 * Created by nero on 2017/4/13.
 */
let ProgressBar = require('./node-progress')

let bar = new ProgressBar(' :title [:bar] :percent ', {
  complete: '=',
  incomplete: ' ',
  width: 30,
  total: 100
})

class progress {
  start (title) {
    if (bar.curr < 99) {
      bar.tick(1, {title: 'progress : '})
    }
  }

  timer (interval, count, time) {
    let self = this
    this.start()
    setTimeout(function () {
      count += 1
      if (count < 99) self.timer(interval, count, time)
    }, interval)
  }

  probytime (time) {
    let interval = 1000 / (99 / time)
    let count = 0
    this.timer(interval, count, time)
  }

  toend () {
    let index = 100 - bar.curr
    bar.tick(index, {title: 'progress'})
    // bar.terminate()
  }

  end (msg) {
    if (bar.complete) {
      console.log(msg)
    }
  }
}

module.exports = progress
