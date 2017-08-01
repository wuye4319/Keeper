/**
 * Created by nero on 2017/3/23.
 * rules of release
 */

function myrelease () {
  this.options = {
    release: './static/release/'
  }
}

// release
myrelease.prototype.release = function () {
  var release = [], confrelease = this.options.release
  var lang = myinfor.lang

  for (var i = 0; i < lang.length; i++) {
    var mypathlist = myinfor.mypathlist[i]
    // release
    var myrelease = {
      html: mypathlist.stat + mypathlist.chtml,
      outhtml: confrelease + mypathlist.chtml,
      js: mypathlist.stat + mypathlist.cjs,
      outjs: confrelease + mypathlist.cjs,
      img: mypathlist.stat + mypathlist.cimg,
      outimg: confrelease + mypathlist.cimg
    }
    release.push(myrelease)
  }

  var data = {
    release: release
  }
  return data
}

module.exports = myrelease
