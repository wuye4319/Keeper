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
      let formData = {
        tmallurl: 'https://pin.aliyun.com/get_img?sessionid=aeb9cf16a16ec9c369e31ccce51b9155&identity=sm-malldetailskip&type=150_40'
      }
      request.post({
        url: 'http://zhlynn.mynetgear.com:3960/GetImageCode2.php?key=haveagoodjob',
        formData: formData
      }, function optionalCallback (error, httpResponse, body) {
        if (error) { console.log('Verification code failed : '.red + error) } else {
          if (body) {
            console.log(body)
          } else {
            console.log('verification code is empty!'.blue)
          }
        }
      })
    })
  }
}

module.exports = InitJs
