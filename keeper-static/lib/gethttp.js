/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const request = require('request')

// constructor
class InitJs {
  async getcode (apiurl, url) {
    return new Promise(async (resolve) => {
      let options = {
        url: apiurl,
        headers: {
          'referer': url
        }
      }

      request(options, function optionalCallback (error, resp, body) {
        if (error) { console.log('get code failed : '.red + error) } else {
          if (body) {
            resolve(body)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}

module.exports = InitJs
