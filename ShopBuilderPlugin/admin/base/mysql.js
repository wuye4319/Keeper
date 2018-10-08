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
  password: '1234',
  database: 'builder'
}
let pool = mysql.createPool(config)

let basesql = {
  myquery: (sql, param, fn) => {
    pool.getConnection((err, connection) => {
      // Use the connection
      connection.query(sql, param, (error, results, fields) => {
        connection.release()
        if (error) throw error
        fn(results)
      })
    })
  },
  endconn: () => {
    pool.end()
    console.log('mysql connection is cloes!'.red)
  }
}

module.exports = basesql
