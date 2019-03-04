/**
 * author : nero
 */
class render {
  constructor () {this.options = {sTag: '<%', eTag: '%>', debugcompiler: !1, compress: !1}}

  renderdata (a, b, c) {
    '[object Array]' === Object.prototype.toString.call(b) && (b = {data: b})
    let e = this.options.sTag, f = this.options.eTag, g = a.split(e), h = c || this.options.compress, j = this.options.debugcompiler,
      l = 'var js=\'\''
    for (let o, n = 0; n < g.length; n++) o = g[n].split(f), 0 !== n && (l += this.parsepage(o[0])), l += '+\'' +
      o[o.length - 1].replace(/\'/g, '\\\'').replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n') + '\''
    l += ';return js;'
    let m = this.func(b, l)
    return h && (m = m.replace(/\s+/g, ' ').replace(/<!--[\w\W]*?-->/g, '')), j &&
    (console.log(l.yellow), console.log(b.yellow), console.log(m.yellow)), b ? m : this.func
  }

  func (a, b) {
    let c, e = [], f = []
    for (c in a) e.push(c), f.push(a[c])
    return new Function(e, b).apply(a, f)
  }

  encodeHTML (a) {
    return (a + '').replace(/&/g, '&amp;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;').
      replace(/\\/g, '&#92;').
      replace(/"/g, '&quot;').
      replace(/'/g, '&#39;')
  }

  parsepage (a) {
    return a = '=' == a.substr(0, 1)
      ? '+(' + a.substr(2) + ')'
      : 'h=' == a.substr(0, 2)
        ? '+(' + this.encodeHTML(a.substr(3)) + ')'
        : 'u=' == a.substr(0, 2)
          ? '+encodeURI(' + a.substr(3) + ')'
          : ';' + a.replace(/\r\n/g, '') + 'js=js', a
  }
}

module.exports = render
