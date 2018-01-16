/**
 * Created by nero on 2017/3/23.
 */
const fs = require('fs')
const Fsrules = require('../ctrl/loadconf')
let rules = new Fsrules()
let myinfor = rules.infor()

class rulinit {
  // search all dir from dir path
  init (dir) {
    // seo config
    let arrinit = []
    let lang = myinfor.lang
    let isrouter = myinfor.isrouter
    let initpath = myinfor.initpath
    let myseoinfor = rules.seoinfor()

    for (let i = 0; i < lang.length; i++) {
      let mypathlist = rules.mypath(lang[i])
      let singleinfor = (lang[i] === 'cn/' ? myseoinfor[0] : myseoinfor[1])

      arrinit.push({
        // img
        filename: mypathlist.stat + mypathlist.img + myinfor.myChildDir + '.gitkeep',
        template: initpath.imgpath
      }, {
        filename: './front/' + mypathlist.js + myinfor.myChildDir + myinfor.mySource + '.less',
        template: initpath.lesspath,
        data: {'commonless': mypathlist.commonless}
      }, {
        filename: mypathlist.stat + mypathlist.html + myinfor.myChildDir + 'index.html',
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
      if (isrouter !== -1) {
        // no html,creat (img dir,test.js,routerdir .js,test.less)
        arrinit.push({
          filename: './front/' + mypathlist.js + myinfor.myChildDir + myinfor.mySource + '.js', // write into myjs
          template: initpath.rout,
          data: {
            'modulename': mypathlist.myupchildname,
            'myless': mypathlist.myless
          }
        })
      } else {
        // normal dir
        // init
        arrinit.push({
          filename: './front/' + mypathlist.js + myinfor.myChildDir + myinfor.mySource + '.js', // write into myjs
          template: initpath.jspath,
          data: {'myless': mypathlist.myless}
        })
        arrinit[2].data.myjs = mypathlist.myjs
      }
    }

    let data = {
      init: arrinit
    }
    return data
  }

  // update router
  routelist (filelist) {
    let lang = myinfor.lang
    let isrouter = myinfor.isrouter
    let initpath = myinfor.initpath

    if (isrouter !== -1) {
      let arrrouter = []
      for (let i in lang) {
        let mypathlist = rules.mypath(lang[i])// mypathlist
        // [ cn , en ]
        let txtindex = (lang[i] === 'en/' ? 1 : 0)
        let childlist = []
        let namelist = []
        let newchild = []
        let normlist = []
        // router dir
        // creat childlist from childlist.js[json file]
        // single router module
        let myaccount = filelist[(lang[i] || 'cn/').substr(0, 2)] || ''
        // read and write routername.js, always from cn or main dir.
        let namefile = './front/' + (lang[i] ? 'cn/' : '') + 'source/js/' + myinfor.myModuleDir + '/routername.js'
        let namestr = eval(fs.existsSync(namefile) ? fs.readFileSync(namefile).toString() : '')
        let staticfile = this.staticname(namestr, myaccount)
        let navlist = []
        // each all router dir
        for (let d in myaccount) {
          let parent = ''
          let routname
          let jsname = myaccount[d].substr(myaccount[d].lastIndexOf('/') + 1)
          let keyname = myaccount[d]
          routname = namestr ? namestr[keyname] : ''
          // init attr for routername.js
          if (routname) {
            let tempobj2 = {}
            tempobj2[myaccount[d]] = JSON.stringify(routname)
            namelist.push(tempobj2)
            parent = routname.parent
          } else {
            // for tempobj to use
            routname = {txt: ['', ''], mysort: d}
            let tempobj1 = {}
            tempobj1[myaccount[d]] = JSON.stringify({txt: ['', ''], parent: '', mysort: '1'})
            namelist.push(tempobj1)
          }

          // child {txt:"",link:"",req:"",file:""}
          let tempobj = {}
          tempobj.txt = routname.txt[txtindex]
          tempobj.link = '/' + myinfor.basepath + mypathlist.html + myaccount[d] + '/'
          tempobj.req = './' + myaccount[d] + '/' + jsname
          tempobj.file = '/' + myinfor.basepath + mypathlist.js + myaccount[d] + '/' + jsname
          tempobj.icon = routname.icon
          tempobj.mysort = routname.mysort
          tempobj.myref = routname.myref

          let data = this.listnav(parent, namestr, tempobj, navlist, childlist, normlist, txtindex)
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
    let templist = []
    for (let i in data) {
      if (data[i]) {
        templist.push(data[i])
      }
    }
    return templist
  }

  sortchildlist (data) {
    let mydatalist = []
    for (let i in data) {
      let sortindex = data[i].mysort
      if (mydatalist[sortindex]) {
        mydatalist.push(data[i])
      } else {
        mydatalist[sortindex] = data[i]
      }
    }
    return mydatalist
  }

  listnav (parent, namestr, tempobj, navlist, childlist, normlist, i) {
    if (parent) {
      try {
        let attrnav = namestr[parent]
        // parent nav is exist
        if (attrnav) {
          let isnavlist = navlist.indexOf(parent)
          tempobj = JSON.stringify(tempobj)
          if (isnavlist === -1) {
            // parent {txt:"",child:[]}
            navlist.push(parent)
            let tempobjparent = {}
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
    let data = {navlist: navlist, childlist: childlist, normlist: normlist}
    return data
  }

  staticname (data, router) {
    let list = []
    for (let i in data) {
      let isrouter = router.indexOf(i)
      if (isrouter === -1) {
        let tempobj = {}
        tempobj[i] = JSON.stringify(data[i])
        list.push(tempobj)
      }
    }
    return list
  }

  addstatic (data, namestr, navlist, childlist, normlist, index) {
    for (let i in data) {
      let mydata = JSON.parse(Object.values(data[i]))
      if (mydata.href) {
        let tempobj = {}
        tempobj.txt = mydata.txt[index]
        tempobj.href = mydata.href[index]
        tempobj.icon = mydata.icon
        tempobj.mysort = mydata.mysort
        tempobj.myref = mydata.myref
        let parent = mydata.parent
        let result = this.listnav(parent, namestr, tempobj, navlist, childlist, normlist, index)
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
