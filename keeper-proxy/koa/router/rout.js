/**
 * Created by nero on 2017/6/2.
 */
const server = require('../index')
const launcher = require('../static/launcher')
const StaticFiles = require('../static/static')
let staticFiles = new StaticFiles()

// static
launcher.addrouter(/^\/(\w+)(?:\/|$)/, async (ctx) => {
  await staticFiles.getfile(ctx, '/static/', './static')
})
