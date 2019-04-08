/**
 * Created by nero on 2017/6/29.
 * ready
    { name: 'less', ver: '2.7.2' },
    { name: 'less-loader', ver: '4.0.4' },
    { name: 'babel-plugin-import', ver: '1.2.1' },
 * 
 */

module.exports = {
  pluginlist: {
    "babel-core": "6.25.0",
    "babel-preset-env": "1.5.2",
    "babel-preset-react": "6.24.1",
    "babel-preset-stage-0": "6.24.1",
    "css-loader": "0.28.4",
    "less": "2.7.2",
    "less-loader": "4.0.4",
    "style-loader": "0.18.2",
    "url-loader": "0.5.9",
    "babel-loader": "7.1.1",
    "antd": "2.12.2",
    "react-router": "3.0.0",
    "babel-plugin-import": "1.2.1",
    "uglifyjs-webpack-plugin": "^1.2.2",
    "i18n-webpack-plugin": "^1.0.0",
  },
  initfile: [
    { in: './keeper-config.js', out: 'system/config-front.js' },
    { in: './seoinfor.json', out: 'system/seoinfor.json' },
    // { in: './index.html', out: 'init/index.html', force: true },
  ]
}
