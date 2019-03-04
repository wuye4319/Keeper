let program = require('commander');
let cmdlist = require('./cmd')

for (let i in cmdlist) {
  let list = cmdlist[i]

  let temp = program
    .command(list.name)
    .alias(list.alias)
    .description(list.desc)
    .action(list.action)

  if (list.option && list.option.length) {
    for (let j in list.option) {
      let option = list.option[j]
      temp.option(option.cmd, option.desc)
    }
  }
}

program
  .version('0.0.1', '-v, --version')

program
  .command('*')
  .description('check all cmd')
  .action(function (env) {
    console.log('无效的命令: "%s"', env);
  });

program.parse(process.argv)
