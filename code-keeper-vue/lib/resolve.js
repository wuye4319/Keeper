const path = require('path')

module.exports = {
  require: (dir) => {
    let tempPath = path.resolve('./node_modules/' + dir)
    return require(tempPath)
  }
}