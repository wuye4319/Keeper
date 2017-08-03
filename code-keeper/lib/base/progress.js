/**
 * Created by nero on 2017/4/13.
 */
var ProgressBar = require('./node-progress')

var bar = new ProgressBar(' :title [:bar] :percent ', {
  complete: '=',
  incomplete: ' ',
  width: 30,
  total: 100
})

class progress {
  start (title) {
    if (bar.curr < 99) {
      bar.tick(1, {title: 'static'})
    }
  }

  toend () {
    var index = 100 - bar.curr
    bar.tick(index, {title: 'static'})
    // bar.terminate()
  }

  end (msg) {
    if (bar.complete) {
      console.log(msg)
    }
  }
}

module.exports = progress
