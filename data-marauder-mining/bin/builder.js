repls.defineCommand('img', {
  help: 'Get image!'.green,
  action: function () {
    // http://top.baidu.com/?fr=tph_right
    // http://top.baidu.com/buzz?b=341&c=513&fr=topbuzz_b42_c513
  }
})
repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: async function () {
    // koa,do not merge to proxy!
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
