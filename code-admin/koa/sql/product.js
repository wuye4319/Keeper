/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict';
var basemysql = require("../../lib/base/mysql");

var mysql = {
    getprobyid: (id)=> {
        basemysql.myquery("SELECT * FROM product WHERE ID=?", id, (results)=> {
        })
    },
    /**
     * 获取主题商品
     * @param id 主题id
     * @param page 页数
     * @param numb 每页数量
     * @returns {Promise}
     */
    getProListByTheme: (id,page,numb)=> {
        return new Promise((resolve)=> {
            basemysql.myquery('SELECT * FROM product WHERE ThemeID=? AND IsPub=1 ORDER BY MySort,CreatDate DESC LIMIT ?,?', [id,page,numb], (results)=> {
                var temparray=[];
                for(var i in results){
                    var tempobj={};
                    tempobj.mainimg=results[i].MainImg;
                    tempobj.proname=results[i].ProName;
                    tempobj.prohref=results[i].ProHref;
                    tempobj.price=results[i].Price;
                    temparray.push(tempobj);
                }
                resolve(temparray);
            });
        })
    },
}

module.exports = mysql;
