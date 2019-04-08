/**
 * author:nero
 * version:v1.1
 * plugin:code-keeper
 */
const path = require('path')
// const Fsrules = require('./ctrl/loadconf')
// let rules = new Fsrules()
const Webpack = require('webpack')
// config
// let myinfor = rules.infor()
const resolve = require('./resolve')

// constructor
class compile {
  constructor() {
    this.confobj = {
      output: {
        path: path.resolve('./static/'),
        chunkFilename: '[name].part.js?[chunkhash:8]'
      },
      resolve: {
        alias: {
          component: path.resolve('./front/plugin/component')
        }
      }
    }
    // Object.assign(this.confobj, myinfor.config.webpack)
    delete this.confobj.config
  }

  async dev() {
    const WebpackDevServer = resolve.require('webpack-dev-server/lib/Server');
    const webpackConfig = require('../build/dev/webpack.dev.conf');

    let config = await webpackConfig
    const compiler = Webpack(config);
    const devServerOptions = Object.assign({}, config.devServer, {
      stats: {
        colors: true,
      },
      noInfo: true
    });
    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(8080, '127.0.0.1', () => {
      console.log('Starting server on http://localhost:8080');
    });
  }

  pub() {
    const Build = require('../build/pub/build')
    let build = new Build()

    let config = {
      // entry: 'test.js' 
    }
    build.boot(config)
  }
}

module.exports = compile
