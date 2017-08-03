/*
 * author:nero
 * version:v1.0
 * config of rob
 */
var config = {
  fs: './test.xls',
  rowkey: ['A', 'B', 'C', 'F', 'L'],
  mysql: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '4319',
    database: 'wssso'
  },
  delay: {excel: 5, mysql: 3},
  param: {// 采集条件
    ProKind: '101',
    ThemeID: '5',
    IsPub: 0
  }
}

module.exports = config
