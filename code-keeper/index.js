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

class InitJs {
  constructor (options) {
    this.version = 'v1.4.8'
    // Default options
    this.options = {
      filename: options.filename,
      template: options.template,
      data: options.data || {}
    }
  }

  apply (compiler) {
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
      data.other = ''
      // reset all except content
      if (fs.existsSync(outfile)) {
        data.container = self.contstr(outfile)
        data.other = self.getother(outfile)
        data.myjs = myhash
      }
      // render
      str = render.renderdata(tpl, data)
      // write my file And Report
      self.Report(file, str, compilation)

      callback()
    })
  }

  getother (file) {
    let content = fs.readFileSync(file).toString()
    let rule = /<!-- other -->\s([\s\S]+)\s<\/head>/
    let newcont = content.match(rule)[1]
    console.log(newcont)
    return newcont
  }

  contstr (file) {
    let content = fs.readFileSync(file).toString()
    let rule = /<body>\s([\s\S]+)\s<!-- common module -->/
    let newcont = content.match(rule)[1]
    return newcont
  }

  Report (filename, cont, compilation) {
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
}

module.exports = InitJs
