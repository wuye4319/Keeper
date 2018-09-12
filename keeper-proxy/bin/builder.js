const Rout = require('../koa/router/rout')
let rout = new Rout()

repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: async function () {
    // koa,do not merge to proxy!
    rout.close()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
