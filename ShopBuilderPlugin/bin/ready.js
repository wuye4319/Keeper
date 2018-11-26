/**
 * Created by nero on 2017/6/29.
 * ready
 */
const Initnpm = require('keeper-core/lib/npm')
let mynpm = new Initnpm()

class ready {
  boot (plugname) {
    let pluginlist = [
      {name: 'babel-core', ver: '6.25.0'},
      {name: 'babel-preset-env', ver: '1.5.2'},
      {name: 'babel-preset-react', ver: '6.24.1'},
      {name: 'babel-preset-stage-0', ver: '6.24.1'},
      {name: 'css-loader', ver: '0.28.4'},
      {name: 'less', ver: '2.7.2'},
      {name: 'less-loader', ver: '4.0.4'},
      {name: 'style-loader', ver: '0.18.2'},
      {name: 'url-loader', ver: '0.5.9'},
      {name: 'babel-loader', ver: '7.1.1'},
      {name: 'webpack', ver: '3.10.0'},
      {name: 'react-router', ver: '3.0.0'}, // 4.1.2
      {name: 'babel-plugin-import', ver: '1.2.1'},
      {name: 'uglifyjs-webpack-plugin', ver: '1.2.2'},
      {name: 'i18n-webpack-plugin', ver: '1.0.0'},
      {name: 'koa', ver: '2.3.0'},
      {name: 'koa-cors', ver: '0.0.16'},
      {name: 'koa-body', ver: '4.0.4'},
      {name: 'koa-router', ver: '7.2.1'},
      {name: 'mime', ver: '2.3.1'},
      {name: 'request', ver: '2.83.0'}
    ]
    mynpm.init(pluginlist, plugname)
  }
}

module.exports = ready
