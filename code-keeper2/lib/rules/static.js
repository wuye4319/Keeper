/**
 * Created by nero on 2017/3/23.
 * rules of static
 */

function mystatic () {
}

// static
mystatic.prototype.static = function () {
  var arrstatic = []
  var lang = myinfor.lang, proxy = myinfor.config.proxy

  for (var i = 0; i < lang.length; i++) {
    var mypathlist = myinfor.mypathlist[i]
    // static
    arrstatic.push({
      template: proxy + mypathlist.chtml,
      filename: mypathlist.stathtml
    })
  }

  var data = {
    static: arrstatic
  }
  return data
}

module.exports = mystatic
