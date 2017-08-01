/**
 * Created by nero on 2017/3/23.
 */
function conf () {
}

// config
conf.prototype.conf = function (param) {
  if (param.length > 0) {
    var key = param.substr(0, param.indexOf(' '))
    var value = param.substr(param.indexOf(' ') + 1)
    myinfor.config.myModule = value
    this.readconf()
  } else {
    this.readconf()
  }
}

// read config information
conf.prototype.readconf = function () {
  var myconfig = myinfor.config
  var myseo = myrules.seoinfor
  console.log('myModule : \''.green + myconfig.myModule.red + '\''.green)
  console.log('childModule : \''.green + myconfig.childModule.red + '\''.green)
  console.log('lang : \''.cyan + myconfig.lang.red + '\''.cyan)
  console.log('proxy : \''.cyan + myconfig.proxy.red + '\''.cyan)
  console.log('cn : '.blue)
  console.log(JSON.stringify(myseo[0]).yellow)
  console.log('en : '.blue)
  console.log(JSON.stringify(myseo[1]).yellow)
}

module.exports = conf
