/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
'use strict'
const mysql = require('mysql')
let config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '4319',
  database: 'wssso'
}
let pool = mysql.createPool(config)

class basesql {
  myquery (sql, param, fn) {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(sql, param, (error, results, fields) => {
        connection.release()
        if (error) throw error
        fn(results)
      })
    })
  }

  endconn () {
    pool.end()
    console.log('mysql connection is cloes!'.red)
  }

  getarrt (data, out, obj) {
    let temparr = []
    // get arrt you need
    for (let i in data) {
      let tempobj = {}
      for (let j in out) {
        tempobj[out[j]] = data[i][out[j]]
      }
      temparr.push(tempobj)
    }
    return obj ? temparr[0] : temparr
  }
}

module.exports = basesql
