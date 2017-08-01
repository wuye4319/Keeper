/**
 * Created by nero on 2017/3/23.
 */
class rulinit {
  constructor () {
  }

  // search all dir from dir path
  init (dir) {
    // seo config
    var arrinit = [], lang = myinfor.lang, isrouter = myinfor.isrouter
    var initpath = myinfor.initpath, proxy = myinfor.config.proxy

    for (var i = 0; i < lang.length; i++) {
      var mypathlist = myinfor.mypathlist[i]// mypathlist
      var singleinfor = (lang[i] == 'cn/' ? myseoinfor[0] : myseoinfor[1])
      if (isrouter != -1) {
        // no html,creat (img dir,test.js,routerdir .js,test.less)
        arrinit.push({
          filename: mypathlist.statimg,
          template: initpath.imgpath
        }, {
          filename: mypathlist.frtjs, // write into myjs
          template: initpath.rout,
          data: {
            'modulename': mypathlist.myupchildname,
            'myless': mypathlist.myless
          }
        }, {
          filename: mypathlist.frtless,
          template: initpath.lesspath,
          data: {'commonless': mypathlist.commonless}
        }, {
          filename: mypathlist.stathtml,
          template: initpath.htmlpath,
          data: {
            title: singleinfor.title,
            keywords: singleinfor.keyword,
            description: singleinfor.description,
            container: '<div id="container" style="opacity: 0;"><%= container %></div>',
            myjs: mypathlist.myroutjs,
            loadjs: mypathlist.loadjs,
            wrapjs: mypathlist.wrapjs
          }
        })
      } else {
        // normal dir
        // init
        arrinit.push({
          filename: mypathlist.statimg,
          template: initpath.imgpath
        }, {
          filename: mypathlist.stathtml,
          template: initpath.htmlpath,
          data: {
            title: singleinfor.title,
            keywords: singleinfor.keyword,
            description: singleinfor.description,
            container: '<div id="container" style="opacity: 0;"><%= container %></div>',
            myjs: mypathlist.myjs,
            loadjs: mypathlist.loadjs,
            wrapjs: mypathlist.wrapjs
          },
          proxyname: proxy.indexOf('http') >= 0 ? proxy : 'http://' + proxy + mypathlist.chtml
        }, {
          filename: mypathlist.frtjs, // write into myjs
          template: initpath.jspath,
          data: {'myless': mypathlist.myless}
        }, {
          filename: mypathlist.frtless,
          template: initpath.lesspath,
          data: {'commonless': mypathlist.commonless}
        })
      }
    }

    var data = {
      seoinfor: myseoinfor,
      init: arrinit
    }

    return data
  }

  // update router
  routelist (filelist) {
    var lang = myinfor.lang, isrouter = myinfor.isrouter
    var initpath = myinfor.initpath

    if (isrouter != -1) {
      var arrrouter = []
      for (var i = 0; i < lang.length; i++) {
        var mypathlist = myinfor.mypathlist[i]// mypathlist
        var txtindex = (lang[i] == 'en/' ? 1 : 0), childlist = [], namelist = [], newchild = [], normlist = []
        // router dir
        // creat childlist from childlist.js[json file]
        // single router module
        var myaccount = eval('filelist.' + (lang[i] || 'cn/').substr(0, 2)) || ''
        var namefs = ''
        // read and write routername.js, always from cn or main dir.
        var namefile = mypathlist.namefile
        if (fs.existsSync(namefile)) {
          namefs = fs.readFileSync(namefile).toString()
        }
        var namestr = eval(namefs)
        var staticfile = this.staticname(namestr, myaccount)
        var navlist = []
        // each all router dir
        for (var d = 0; d < myaccount.length; d++) {
          var oldlist = [], parent = '', routname
          var jsname = myaccount[d].substr(myaccount[d].lastIndexOf('/') + 1)
          var keyname = myaccount[d]
          routname = namestr ? eval('namestr[\'' + keyname + '\']') : ''
          // init attr for routername.js
          if (!routname) {
            // for tempobj to use
            routname = {txt: ['', ''], mysort: d}
            var tempobj1 = {}
            eval('tempobj1["' + keyname + '"]=JSON.stringify({txt:["",""],parent:"",mysort:"1"})')
            namelist.push(tempobj1)
          } else {
            var tempobj2 = {}
            eval('tempobj2[\'' + keyname + '\']=JSON.stringify(' + JSON.stringify(routname) + ')')
            namelist.push(tempobj2)
            parent = routname.parent
          }

          // child {txt:"",link:"",req:"",file:""}
          var tempobj = {}
          tempobj.txt = routname.txt[txtindex]
          tempobj.link = mypathlist.link + myaccount[d] + '/'
          tempobj.req = './' + myaccount[d] + '/' + jsname
          tempobj.file = mypathlist.file + myaccount[d] + '/' + jsname
          tempobj.icon = routname.icon
          tempobj.mysort = routname.mysort
          tempobj.myref = routname.myref

          var data = this.listnav(parent, namestr, tempobj, navlist, childlist, normlist, txtindex)
          navlist = data.navlist
          childlist = data.childlist
          normlist = data.normlist
        }
        childlist = this.addstatic(staticfile, namestr, navlist, childlist, normlist, txtindex)
        // sort child list by router name .mysort numb
        newchild = this.sortchildlist(childlist)
        newchild = this.removeEmpty(newchild)
        arrrouter.push({
          filename: mypathlist.routjs, // write into myjs
          template: initpath.routjs,
          data: {
            'childlist': newchild,
            currlang: lang[i],
            myrouter: myinfor.config.myModule.toLocaleLowerCase()
          }, // for routerdir .js
          rfname: namefile,
          rnamedata: {'rname': namelist, 'tname': staticfile}// namelist for routername.js
        })
      }
      return arrrouter
    } else {
      return false
    }
  }

  removeEmpty (data) {
    var templist = []
    for (var i = 0; i < data.length; i++) {
      if (data[i]) {
        templist.push(data[i])
      }
    }
    return templist
  }

  sortchildlist (data) {
    var mydatalist = []
    for (var i = 0; i < data.length; i++) {
      var sortindex = data[i].mysort
      if (mydatalist[sortindex]) {
        mydatalist.push(data[i])
      } else {
        mydatalist[data[i].mysort] = data[i]
      }
    }
    return mydatalist
  }

  listnav (parent, namestr, tempobj, navlist, childlist, normlist, i) {
    if (parent) {
      try {
        var attrnav = eval('namestr.' + parent)
        // parent nav is exist
        if (attrnav) {
          var isnavlist = navlist.indexOf(parent)
          tempobj = JSON.stringify(tempobj)
          if (isnavlist == -1) {
            // parent {txt:"",child:[]}
            navlist.push(parent)
            var tempobjparent = {}
            tempobjparent.txt = attrnav.txt[i]
            tempobjparent.child = [tempobj]
            tempobjparent.icon = attrnav.icon
            tempobjparent.mysort = attrnav.mysort
            tempobjparent.myref = attrnav.myref
            childlist.push(tempobjparent)
          } else {
            childlist[isnavlist].child.push(tempobj)
          }
        }
      } catch (err) {
        console.log('parent is error!' + err)
      }
    } else {
      // parent is null
      normlist.push(tempobj)
    }
    var data = {navlist: navlist, childlist: childlist, normlist: normlist}
    return data
  }

  staticname (data, router) {
    var list = []
    for (var i in data) {
      var isrouter = router.indexOf(i)
      if (isrouter == -1) {
        var tempobj = {}
        eval('tempobj[\'' + i + '\']=\'' + JSON.stringify(data[i]) + '\'')
        list.push(tempobj)
      }
    }
    return list
  }

  addstatic (data, namestr, navlist, childlist, normlist, index) {
    for (var i = 0; i < data.length; i++) {
      var mydata = JSON.parse(Object.values(data[i]))
      if (mydata.href) {
        var tempobj = {}
        tempobj.txt = mydata.txt[index]
        tempobj.href = mydata.href[index]
        tempobj.icon = mydata.icon
        tempobj.mysort = mydata.mysort
        tempobj.myref = mydata.myref
        var parent = mydata.parent
        var result = this.listnav(parent, namestr, tempobj, navlist, childlist, normlist, index)
        navlist = result.navlist
        childlist = result.childlist
        normlist = result.normlist
      }
    }
    childlist = childlist.concat(normlist)
    return childlist
  }
}

module.exports = rulinit
