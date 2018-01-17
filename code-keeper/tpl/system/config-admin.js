/*
 *启动方式：node bd,通过.help查看命令
 * 通过.xx执行命令
 */
const config = {
  version: '1.2.0',
  myModule: 'test', // myModule:1级目录
  childModule: '', // childModule:2级目录
  basepath: 'newadmin',
  htmlbasepath: '', // html根目录，空则没有
  lang: '', // cn:中文，en:英文，all:中英文同时编译
  firstlang: 'cn', // 初始语种
  proxy: 'www.dev.com:8013/', // proxy是代理地址，常见：test,super,superbuy,请求是实时的数据
  transfile: 'trans/trans.json', // 默认目录：当前js的同目录下 [trans/trans.json]
  sourcedir: ['src'], // js需要过滤的资源目录
  routerdir: ['prolibrary'], // router的根目录
  wrapper: 'wrapper/Wrapper.js', // 公共模块
  userinfor: '@author Nero @time ' + new Date().toISOString().split('T')[0],
  webpack: {
    config: {chunks: false, colors: true, version: true, hash: true, assets: true, modules: false},
    externals: {'react': 'React', 'react-dom': 'ReactDOM'},
    plugins: [], // 默认自带插件：[i18n]，可以继续添加其他插件
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'env', 'stage-0'],
              plugins: [// antd的动态引入编译，及css样式文件编译
                ['import', {libraryName: 'antd', style: 'css'}]
              ]
            }
          }
        },
        {test: /\.less$/, use: [{loader: 'style-loader'}, {loader: 'css-loader'}, {loader: 'less-loader'}]},
        {test: /\.css/, use: [{loader: 'style-loader'}, {loader: 'css-loader'}]},
        {test: /\.(png|jpg|jpeg)$/, use: {loader: 'url-loader', options: {limit: 5120}}}
      ]
    }
  }
}

module.exports = config
