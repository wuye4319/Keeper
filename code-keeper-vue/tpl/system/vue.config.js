module.exports = {
  publicPath: './',
  pages: {
    app: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Index Page',
      keywords: 'index page',
      chunks: ['chunk-vendors', 'chunk-common', 'app']
    },
  },
  configureWebpack: config => {
    config.externals = {
      // 'vue': 'Vue',
      // 'vue-router': 'VueRouter',
    }
  },
  // chainWebpack: (config) => {
  //   config.resolve.alias
  //     .set('assets', resolve('src/assets'))
  //     .set('pages', resolve('src/pages'))
  //     .set('components', resolve('src/components'))
  //     .set('utils', resolve('src/utils'))
  // },
  devServer: {
    host: 'localhost',
    port: 8008,
    https: false,
    hotOnly: false,
    disableHostCheck: false,
    proxy: {
      '/api/v0/': {
        // 目标 API 地址
        target: 'http://127.0.0.1:4545',
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
      },
    },
  }
}
