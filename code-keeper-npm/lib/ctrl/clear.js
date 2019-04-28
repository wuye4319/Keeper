/**
 * Created by nero on 2017/3/21.
 * clear files
 * * * *
 * if config.js changed, please reload.
 * we execute rules.js only in the reload.
 * require execute only one times.
 */
const path = require('path')
const Del = require('keeper-core/lib/delete')
let del = new Del()
const Fseachdir = require('./eachdir')
let eachdir = new Fseachdir()
const inquirer = require('inquirer');
const Create = require('./create')
let create = new Create()
const Fsinit = require('./routinfor')
let initrouter = new Fsinit()
const pathconfig = require('./pathconfig')

class clear {
  constructor() {
    this.option = pathconfig
  }

  async clearComponent() {
    let self = this
    const except = this.option.pages.Except
    let tempath = path.join(self.option.root, self.option.pages.filelist[2].filename)
    let filelist = await eachdir.dirlist(tempath, except)

    // select page
    inquirer.prompt([{
      type: 'list',
      message: '请选择要清理的组件碎片所在页面:',
      name: 'page',
      choices: filelist
    }]).then(async d => {
      let tempath = path.join(self.option.root, self.option.pages.filelist[2].filename + d.page)
      let filepartlist = await eachdir.dirlist(tempath, 'index.ts', 'file')

      // select component
      inquirer.prompt([{
        type: 'list',
        message: '请选择需要清理的组件碎片:',
        name: 'part',
        choices: filepartlist
      }]).then(pa => {
        let delfile = path.join(tempath, pa.part)
        del.deleteSource(delfile)

        let action = path.join(self.option.root)
        this.updateindex(action, d.page, self.option.pages.filelist)
      })
    })
  }

  async updateindex(action, pagename, filelist) {
    let filebox = [], compfile = []
    let setpath = path.join(action, filelist[2].filename, pagename)
    compfile = await eachdir.dirlist(setpath, 'index.ts', 'file', 1)

    let cfile = {
      filename: path.join(action, filelist[2].filename, pagename, 'index.ts'),
      data: { complist: compfile },
      template: path.join(__dirname, filelist[2].template)
    }
    filebox.push(cfile)
    create.writeinitfile(filebox)
  }

  updaterout(paramaction, pagename) {
    let filebox = []
    let wfile = {}
    let filelist = this.option.pages.filelist
    let action = path.join(this.option.root, paramaction)
    wfile.filename = path.join(action, filelist[0].filename)
    wfile.data = initrouter.delrout(wfile.filename, pagename)
    wfile.template = path.join(__dirname, filelist[0].template)
    filebox.push(wfile)
    // create.writeinitfile(filebox)
  }

  async clearPage() {
    const except = this.option.pages.Except
    let self = this
    let tempath = path.join(self.option.root, self.option.pages.filelist[2].filename)
    let filelist = await eachdir.dirlist(tempath, except)

    // select page
    inquirer.prompt([{
      type: 'list',
      message: '请选择需要清理的页面:',
      name: 'page',
      choices: filelist
    }]).then(async d => {
      let tempath = path.join(self.option.root, self.option.pages.filelist[2].filename, d.page + '/')
      let delfile = path.join(self.option.root, self.option.pages.filelist[1].filename, d.page + '.vue')
      del.deleteSource(tempath, 'all')
      del.deleteSource(delfile)

      this.updaterout('', d.page)
    })
  }
}

module.exports = clear
