const path = require('path');

const fs = require('fs');

const mocksDir = path.resolve(__dirname, './mock');

const util = require('./demos/build/util');

const env = require('./demos/build/config').env;

module.exports = {
  publicPath: '/',
  pages: {
    app: {
      entry: 'demos/main.ts',
      template: 'demos/index.html',
      filename: 'index.html'
    },
    login: {
      entry: 'demos/views/login/login.ts',
      template: 'demos/views/login/login.html',
      filename: 'login.html'
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#107FFF'
        },
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: (config) => {
    config.externals = {
      // 'vue': 'Vue',
      // 'vue-router': 'VueRouter',
    };
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('@demos', path.join(__dirname, 'demos'));
  },
  devServer: {
    port: 8088,
    index: 'home.html',
    open: true,
    openPage: 'login.html',
    disableHostCheck: true,
    proxy: {
      '/apis': {
        target: env.proxyTarget,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/apis': '' },
      },
      ...util.getDevServers(),
    },
    before: (app) => {
      if (process.env.NODE_ENV === 'mock') {
        const setMock = (mockDir) => {
          fs.readdirSync(mockDir).forEach((file) => {
            const filePath = path.resolve(mockDir, file);
            let mocks;
            if (fs.statSync(filePath).isDirectory()) {
              setMock(filePath);
            } else {
              mocks = require(filePath);
              mocks.forEach((mock) => {
                if (mock.isOpen) {
                  app.use(mock.api, mock.response);
                }
              });
            }
          });
        };
        setMock(mocksDir);
      }
      /**
       * 支持跨域访问
       */
      app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        res.header('X-Powered-By', '3.2.1');
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }
  }
};
