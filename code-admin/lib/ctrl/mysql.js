/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict';
var basemysql = require("../base/mysql");

var mysql = {
    addpro: function (data) {
        return new Promise((resolve)=> {
            basemysql.myquery('insert into product set MainImg=?,ProName=?,ProHref=?,Price=?,ProKind=?,ThemeID=?,IsPub=?',
                [data.MainImg, data.ProName, data.ProHref, data.Price, data.ProKind, data.ThemeID, data.IsPub],
                function (results) {
                    if (results.insertId) {
                        console.log("data insert success! insertid is : ".green + results.insertId);
                        resolve();
                    } else {
                        console.log("data insert failed!".red + results);
                    }
                })
        })
    },
    getpro: function (id) {
        return new Promise((resolve)=> {
            basemysql.myquery('select * from product where ID=? ', id, function (results) {
                resolve(results);
            });
        })
    }
}

module.exports = mysql;
