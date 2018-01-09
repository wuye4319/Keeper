/**
 * author:nero
 * version:v1.0
 * plugin:init js
 * add hash to js
 */
'use strict'
const fs = require('fs')

const Render = require('keeper-core/lib/render')
let render = new Render()

// constructor
function InitJs (options) {
  this.version = 'v1.4.8'
  // Default options
  this.options = {
    filename: options.filename,
    template: options.template,
    data: options.data || {}
  }
}

// bootstrap of this program
InitJs.prototype.apply = function (compiler) {
  let self = this
  let data = self.options.data
  var myjs = data.myjs

  compiler.plugin('emit', function (compilation, callback) {
    // hash
    var changedChunks = compilation.chunks.filter(function (chunk) {
      return chunk.hash
    })
    // write file
    var file = self.options.filename
    var outfile = './static/' + self.options.filename
    let tpl = fs.readFileSync(self.options.template).toString()
    var isfirst = myjs.indexOf('?')
    var subjs = isfirst != -1 ? myjs.substr(0, myjs.indexOf('?')) : myjs
    let myhash = subjs + '?' + changedChunks[0].hash
    let str
    // reset all except content
    if (fs.existsSync(outfile)) {
      data.container = self.contstr(outfile)
      data.myjs = myhash
    }
    // render
    str = render.renderdata(tpl, data)
    // write my file And Report
    self.Report(file, str, compilation)

    callback()
  })
}

InitJs.prototype.hascont = function (str, content) {
  var strn = str + '\n'
  var strr = str + '\r'
  var strnr = str + '\r\n'
  if (content.indexOf(strn) != -1) {
    return content.indexOf(strn) + strn.length
  } else if (content.indexOf(strnr) != -1) {
    return content.indexOf(strnr) + strnr.length
  } else if (content.indexOf(strr) != -1) {
    return content.indexOf(strr) + strr.length
  }
}

InitJs.prototype.contstr = function (file) {
  var content = fs.readFileSync(file).toString()
  // windows \r\n
  var firstStr = '<body>'
  var endStr = '\n<!-- common module -->'
  var hascont = this.hascont(firstStr, content)
  var contstr = content.substr(hascont)
  var newcont = contstr.substr(0, contstr.indexOf(endStr))
  return newcont
}

// write file and report to webpack controller
InitJs.prototype.Report = function (filename, cont, compilation) {
  // update assets infor
  compilation.assets[filename] = {
    source: () => {
      return cont
    },
    size: function () {
      return this.source().length
    }
  }
}

module.exports = InitJs
