/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
var fs = require('fs')
const vm = require('vm')
var cheerio = require('cheerio')
var request = require('request')
const Render = require('./render')
let render = new Render()
var Writefile = require('./writefile')
let writefile = new Writefile()

// constructor
class InitJs {
  // init the plugin 'phantom'
  staticpage (file, url, Prompt) {
    // var t = Date.now()

    request('http://buy.superbuy.com/plugin/base/react-with-addons.min.js', function (error, response, body) {
      if (error) { console.log('FAIL to load the address'.red, error) } else {
        var result = vm.runInThisContext(body)
        console.log(result)
        // this.writefile(file,body);
        // this.endstat(Prompt);
      }
    })
  }

  writefile (file, body, Prompt) {
    var $ = cheerio.load(body)
    var html = $('#container').html()
    // write file
    var tpl = fs.readFileSync(file).toString()
    var data = {container: html}
    var str = render.renderdata(tpl, data)
    var newfile = writefile.writejs(file, str)
    newfile ? console.log(file.yellow + ' is init sucessed!'.blue) : console.log(file.yellow + ' is init failed!'.red)
    console.log(file.yellow + ' was overwrite!'.cyan)
  }

  endstat (Prompt) {
    // count time
    let t = Date.now()
    console.log('Loading time '.green + (t / 1000).toString().red + ' second'.green)
    !Prompt || Prompt.displayPrompt()
  }
}

module.exports = InitJs
