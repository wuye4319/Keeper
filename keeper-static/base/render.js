/**
 * author:nero
 * version:v1.0
 * plugin:render page
 * params1:tpl //dom
 * params2:data //json
 * params3:compress //like uglify
 */
// constructor
class render {
  constructor () {
    // Default options
    this.options = {
      sTag: '<%',
      eTag: '%>',
      debugcompiler: false,
      compress: false
    }
  }

  // renderdata
  renderdata (tpl, data, compress) {
    // if data is array
    if (Object.prototype.toString.call(data) === '[object Array]') {
      data = {'data': data}
    }
    let sTag = this.options.sTag, eTag = this.options.eTag, tpls = tpl.split(sTag),
      mycompress = compress || this.options.compress, debugcompiler = this.options.debugcompiler, code = 'var js=\'\''
    for (let t = 0; t < tpls.length; t++) {
      let p = tpls[t].split(eTag)
      if (t !== 0) {
        // code += this.parsepage(p[0]);
        code += this.parsepage(p[0])
      }
      // \' support single quotation mark model
      code += '+\'' + p[p.length - 1].replace(/\'/g, '\\\'').replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n') + '\''
    }
    code += ';return js;'
    let html = this.func(data, code)
    !mycompress || (html = html.replace(/\s+/g, ' ').replace(/<!--[\w\W]*?-->/g, ''))
    if (debugcompiler) {
      console.log(code.yellow)
      console.log(data.yellow)
      console.log(html.yellow)
    }
    return data ? html : this.func
  }

  // make function by running
  func (d, code) {
    let i, k = [], v = []
    for (i in d) {
      k.push(i)
      v.push(d[i])
    }
    // apply(this,v)
    return (new Function(k, code)).apply(d, v)
  }

  // encode html code
  encodeHTML (source) {
    return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\/g, '&#92;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  }

  // parse page
  parsepage (line) {
    if (line.substr(0, 1) == '=') {
      line = '+(' + line.substr(2) + ')'
    } else if (line.substr(0, 2) == 'h=') {
      line = '+(' + this.encodeHTML(line.substr(3)) + ')'
    } else if (line.substr(0, 2) == 'u=') {
      line = '+encodeURI(' + line.substr(3) + ')'
    } else {
      line = ';' + line.replace(/\r\n/g, '') + 'js=js'
    }
    return line
  }
}

module.exports = render
