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
  let myjs = data.myjs

  compiler.plugin('emit', function (compilation, callback) {
    // hash
    let changedChunks = compilation.chunks.filter(function (chunk) {
      return chunk.hash
    })
    // write file
    let file = self.options.filename
    let outfile = './static/' + self.options.filename
    let tpl = fs.readFileSync(self.options.template).toString()
    let isfirst = myjs.indexOf('?')
    let subjs = isfirst !== -1 ? myjs.substr(0, myjs.indexOf('?')) : myjs
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
  let strn = str + '\n'
  let strr = str + '\r'
  let strnr = str + '\r\n'
  if (content.indexOf(strn) !== -1) {
    return content.indexOf(strn) + strn.length
  } else if (content.indexOf(strnr) !== -1) {
    return content.indexOf(strnr) + strnr.length
  } else if (content.indexOf(strr) !== -1) {
    return content.indexOf(strr) + strr.length
  }
}

InitJs.prototype.contstr = function (file) {
  let content = fs.readFileSync(file).toString()
  // windows \r\n
  let firstStr = '<body>'
  let endStr = '\n<!-- common module -->'
  let hascont = this.hascont(firstStr, content)
  let contstr = content.substr(hascont)
  let newcont = contstr.substr(0, contstr.indexOf(endStr))
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
