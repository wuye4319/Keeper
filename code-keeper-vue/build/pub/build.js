'use strict'
const pathres = require('../../lib/resolve')
const ora = pathres.require('ora')
const rm = pathres.require('rimraf')
const path = require('path')
const chalk = pathres.require('chalk')
const webpack = require('webpack')

class build {
  done(webpackConfig, spinner) {
    webpack(webpackConfig, (err, stats) => {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  }

  boot(userconfig) {
    process.env.NODE_ENV = 'production'

    const config = require('../../config')
    require('./check-versions')()
    const webpackConfig = require('./webpack.prod.conf')
    Object.assign(webpackConfig, userconfig)
    // console.log(webpackConfig)

    const spinner = ora('building for production...')
    spinner.start()

    rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
      if (err) throw err
      this.done(webpackConfig, spinner)
    })

  }
}

module.exports = build
