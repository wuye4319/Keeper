/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const request = require('request')

// constructor
class InitJs {
  async getdata (apiurl, ref) {
    return new Promise(async (resolve) => {
      let options = {
        url: apiurl,
        headers: {
          'referer': ref
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
