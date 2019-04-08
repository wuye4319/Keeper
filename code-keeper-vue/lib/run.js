const npm = require('npm')

class run {
  config() {
    npm.load(function (err) {
      if (err) return console.log(err)
      var newreg = npm.config.get('registry')
      console.log(newreg)
    })
  }
  
  run(key) {
    npm.load(function (err) {
      if (err) return console.log(err)
      npm.commands.run([key], function (er) {
        if (er) console.log(er)
      })
    })
  }
}

module.exports = run
