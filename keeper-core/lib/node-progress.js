function ProgressBar (fmt, options) {
  this.stream = options.stream || process.stdout

  if (typeof (options) === 'number') {
    var total = options
    options = {}
    options.total = total
  } else {
    options = options || {}
    if (typeof fmt !== 'string') throw new Error('format required')
    if (typeof options.total !== 'number') throw new Error('total required')
  }

  this.fmt = fmt
  this.curr = 0
  this.total = options.total
  this.width = options.width || this.total
  this.clear = options.clear
  this.chars = {
    complete: options.complete || '=',
    incomplete: options.incomplete || '-'
  }
  this.callback = options.callback || function () {}
  this.lastDraw = ''
}

ProgressBar.prototype.tick = function (len, tokens) {
  if (len !== 0) { len = len || 1 }

  // swap tokens
  if (typeof len === 'object') tokens = len, len = 1

  // start time for eta
  if (this.curr == 0) this.start = new Date()

  this.curr += len
  this.render(tokens)

  // progress complete
  if (this.curr >= this.total) {
    this.complete = true
    this.terminate()
    this.callback(this)
  }
}

ProgressBar.prototype.render = function (tokens) {
  if (!this.stream.isTTY) return

  var ratio = this.curr / this.total
  ratio = Math.min(Math.max(ratio, 0), 1)

  var percent = ratio * 100
  var incomplete, complete, completeLength
  var elapsed = new Date() - this.start
  var eta = (percent == 100) ? 0 : elapsed * (this.total / this.curr - 1)

  /* populate the bar template with percentages and timestamps */
  var str = this.fmt
    .replace(':current', this.curr)
    .replace(':total', this.total)
    .replace(':elapsed', isNaN(elapsed) ? '0.0' : (elapsed / 1000).toFixed(1))
    .replace(':eta', (isNaN(eta) || !isFinite(eta)) ? '0.0' : (eta / 1000)
      .toFixed(1))
    .replace(':percent', percent.toFixed(0) + '%')

  /* compute the available space (non-zero) for the bar */
  var availableSpace = Math.max(0, this.stream.columns - str.replace(':bar', '').length)
  var width = Math.min(this.width, availableSpace)

  /* TODO: the following assumes the user has one ':bar' token */
  completeLength = Math.round(width * ratio)
  complete = Array(completeLength + 1).join(this.chars.complete)
  incomplete = Array(width - completeLength + 1).join(this.chars.incomplete)

  /* fill in the actual progress bar */
  str = str.replace(':bar', complete + incomplete)

  /* replace the extra tokens */
  if (tokens) for (var key in tokens) str = str.replace(':' + key, tokens[key])

  if (this.lastDraw !== str) {
    this.stream.cursorTo(0)
    this.stream.clearLine()
    this.stream.write(str)
    this.lastDraw = str
  }
}

ProgressBar.prototype.update = function (ratio, tokens) {
  var goal = Math.floor(ratio * this.total)
  var delta = goal - this.curr

  this.tick(delta, tokens)
}

ProgressBar.prototype.terminate = function () {
  if (this.clear) {
    this.stream.clearLine()
    this.stream.cursorTo(0)
  } else console.log()
}

module.exports = ProgressBar
