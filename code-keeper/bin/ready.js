/**
 * Created by nero on 2017/6/29.
 * ready
 */
const Initnpm = require('keeper-core/lib/npm')
let mynpm = new Initnpm()

class ready {
  boot () {
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
      {name: 'antd', ver: '2.12.2'},
      {name: 'webpack', ver: '3.0.0'},
      {name: 'react-router', ver: '3.0.0'}, // 4.1.2
      {name: 'i18n-webpack-plugin', ver: '1.0.0'},
      {name: 'babel-plugin-import', ver: '1.2.1'},
    ]
    mynpm.init(pluginlist, 'code-keeper')
  }
}

module.exports = ready
