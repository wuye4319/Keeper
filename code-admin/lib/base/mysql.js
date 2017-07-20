/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict';
var mysql = require('mysql');
var config = require('../../config/robconf');
var pool = mysql.createPool(config.mysql);

var basesql = {
    myquery: (sql, param, fn)=> {
        pool.getConnection((err, connection) => {
            // Use the connection
            connection.query(sql, param, (error, results, fields)=> {
                connection.release();
                if (error) throw error;
                fn(results);
            });
        });
    },
    endconn: ()=> {
        pool.end();
        console.log("mysql connection is cloes!".red);
    }
}

module.exports = basesql;
