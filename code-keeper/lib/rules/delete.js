/**
 * Created by nero on 2017/3/23.
 * rule of clear
 */

function mydelete () {
}

// delete
mydelete.prototype.delete = function () {
  var lang = myinfor.lang
  var mypathlist = myinfor.mypathlist
  var arrdel = []
  for (var i = 0; i < lang.length; i++) {
    // delete
    arrdel.push(
      {filename: mypathlist[i].statimg},
      {filename: mypathlist[i].stathtml},
      {filename: mypathlist[i].frtjs},
      {filename: mypathlist[i].frtless},
      {filename: mypathlist[i].statjs},
      {filename: mypathlist[i].statpart})
  }
  return arrdel
}

module.exports = mydelete
