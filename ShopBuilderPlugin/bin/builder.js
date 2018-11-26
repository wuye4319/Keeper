const Rout = require('../koa/router/rout')
let rout = new Rout()

repls.defineCommand('/', {
  help: 'end and exit'.red,
  action: function () {
    rout.closeall()
    console.log('Thanks for using! Bye~~~'.rainbow)
    this.close()
  }
})
