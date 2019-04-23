/**
 * auther : nero
 * 2019-4-16
 * 路径规则配置
 */

module.exports = {
  root: './src/',
  package: './package.json',
  action: { from: '../../tpl/action', to: './src/' },
  obj: { from: '../../tpl/obj', to: './' },
  pages: {
    Except: ['common', 'wrapper'],
    mainrout: { // wrapper router
      template: '../../tpl/action/router/index.txt',
      filename: '/router/index.ts',
    },
    filelist: [
      { // router
        template: '../../tpl/page/router/index.txt',
        filename: '/router/index.ts',
      },
      { // page home
        filename: '/pages/',
        template: '../../tpl/page/pages/home.txt',
      },
      { // comp index
        filename: '/components/',
        template: '../../tpl/page/components/home/index.txt',
      },
      { // comp home
        template: '../../tpl/page/components/home/home.txt',
      }
    ]
  }
}
