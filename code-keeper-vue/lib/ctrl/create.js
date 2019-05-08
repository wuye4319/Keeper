/**
 * Created by nero on 2019/3/27.
 */
const path = require('path')
const fs = require('fs')
const Render = require('keeper-core/lib/render')
let render = new Render()
const Fsinit = require('./routinfor')
let initrouter = new Fsinit()
const Del = require('keeper-core/lib/delete')
let del = new Del()

const Fseachdir = require('./eachdir')
let eachdir = new Fseachdir()
const Writefile = require('keeper-core/lib/writefile')
let writefile = new Writefile()
const inquirer = require('inquirer');
const { spawnSync } = require('child_process');
const pathconfig = require('./pathconfig')

module.exports = class {
  constructor() {
    this.option = pathconfig
  }

  checkenv() {
    let currpath = path.resolve(this.option.package)
    if (fs.existsSync(currpath)) {
      return true
    } else {
      console.log('环境错误！'.red)
    }
  }

  createAction() {
    const promptList = [{
      type: 'input',
      message: '请填写功能模块的名称(英文):',
      name: 'acname'
    }, {
      type: 'input',
      message: '请填写功能模块的标题(中文):',
      name: 'title'
    }];

    inquirer.prompt(promptList).then(a => {
      if (a.acname && a.title) {
        let action = this.option.action
        let from = path.join(__dirname, action.from)
        let to = path.resolve(this.option.root + a.acname)
        writefile.copydir(from, to)
        this.writepage(a.acname, 'index', a.title)
      } else {
        console.log('请填写模块信息')
      }
    })
  }

  async createComponent() {
    // compo.createComp()
    const root = path.join(this.option.root)
    const except = this.option.pages.Except
    let dirlist = await eachdir.dirlist(root, except)
    let self = this

    inquirer.prompt([{
      type: 'list',
      message: '请选择组件碎片生成的位置:',
      name: 'action',
      choices: dirlist
    }]).then(async ac => {
      let tempath = path.join(self.option.root, ac.action + self.option.pages.filelist[1].filename)
      let filelist = await eachdir.dirlist(tempath, '', 'file')

      inquirer.prompt([{
        type: 'list',
        message: '请选择组件碎片关联页面:',
        name: 'page',
        choices: filelist
      }, {
        type: 'input',
        message: '请填写组件碎片的名称(英文):',
        name: 'compname'
      }]).then(d => {
        let action = path.join(this.option.root, ac.action)
        let filelist = this.option.pages.filelist
        this.writecomp(action, d.page.split('.')[0], filelist, d.compname)
      })
    })
  }

  async writecomp(action, pagename, filelist, compname) {
    let filebox = [], compfile = []
    if (compname) {
      let setpath = path.join(action, filelist[2].filename, pagename)
      compfile = await eachdir.dirlist(setpath, 'index.ts', 'file', 1)
    }
    compfile.push(compname || pagename)

    let cfile = {
      filename: path.join(action, filelist[2].filename, pagename, 'index.ts'),
      data: { complist: compfile },
      template: path.join(__dirname, filelist[2].template)
    }
    filebox.push(cfile)

    let cfile2 = {
      filename: path.join(action, filelist[2].filename, pagename, (compname || pagename) + '.vue'),
      data: { name: pagename },
      template: path.join(__dirname, filelist[3].template)
    }
    filebox.push(cfile2)
    this.writeinitfile(filebox)
  }

  async createPage() {
    const root = path.join(this.option.root)
    const except = this.option.pages.Except
    let dirlist = await eachdir.dirlist(root, except)

    const promptList = [{
      type: 'list',
      message: '请选择生成位置:',
      name: 'action',
      choices: dirlist
    }, {
      type: 'input',
      message: '请填写页面名称(英文):',
      name: 'pagename'
    }, {
      type: 'input',
      message: '请填写页面标题(中文):',
      name: 'pagetitle'
    }];

    inquirer.prompt(promptList).then(d => {
      if (d.action && d.pagename && d.pagetitle) { // 去重，大小写统一
        this.writepage(d.action, d.pagename, d.pagetitle)
      } else {
        console.log('参数错误，请重新填写！'.red)
      }
    })
  }

  writepage(paramaction, pagename, pagetitle) {
    let filebox = []
    let wfile = {}
    let filelist = this.option.pages.filelist
    let action = path.join(this.option.root, paramaction)
    wfile.filename = path.join(action, filelist[0].filename)
    wfile.data = initrouter.routinfor(wfile.filename, pagename, pagetitle, paramaction)
    wfile.template = path.join(__dirname, filelist[0].template)
    filebox.push(wfile)

    let wfile1 = {
      filename: path.join(action, filelist[1].filename, pagename + '.vue'),
      data: { name: pagename, action: paramaction },
      template: path.join(__dirname, filelist[1].template)
    }
    filebox.push(wfile1)
    this.writeinitfile(filebox)

    // components
    this.writecomp(action, pagename, filelist)
  }

  createObj() {
    let tpl = this.option.obj
    // 初始化
    let from = path.join(__dirname, tpl.from)
    let to = path.resolve(tpl.to + '/src/')
    writefile.copydir(from, to)

    // config
    let config = this.option.config
    let from2 = path.join(__dirname, config.from)
    let to2 = path.resolve(tpl.to)
    writefile.copydir(from2, to2)

    // empty action
    let action = this.option.action
    let from1 = path.join(__dirname, action.from)
    writefile.copydir(from1, to + '/demo/')
    this.writepage('demo', 'index', '首页')
  }

  // rewrite file router.ts
  writeinitfile(init) {
    for (let i in init) {
      let mydata = init[i]
      let tpl = fs.readFileSync(mydata.template).toString()
      let data = mydata.data
      let str = render.renderdata(tpl, data)
      // write my file And Report
      writefile.writejs(mydata.filename, str)
    }
  }
}
