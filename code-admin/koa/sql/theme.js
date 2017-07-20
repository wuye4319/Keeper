/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict';
var basemysql = require("../../lib/base/mysql");
var product = require("./product");

var mysql = {
    /**
     * 获取主题列表
     * @param id 分类
     * @param page
     * @returns {Promise}
     */
    getThemeList: function (id, page) {//获取主题列表
        return new Promise((resolve)=> {
            basemysql.myquery('select * from pro_theme where KindID=? order by ThemeID limit 0,10', [id], async(results) => {
                var temparray = [];
                for (var i in results) {
                    var tempobj = {};
                    var hotpro = await product.getProListByTheme(results[i].ThemeID, 0, 3);
                    tempobj.themeid = results[i].ThemeID;
                    tempobj.title = results[i].ThemeTitle;
                    tempobj.mainimg = results[i].MainImg;
                    tempobj.logo = results[i].Logo;
                    tempobj.detail = results[i].ThemeDetail;
                    tempobj.hotpro = hotpro;
                    temparray.push(tempobj);
                }
                resolve(temparray);
            });
        })
    },
    getThemeListNoHot: function (id, num) {//获取主题列表
        return new Promise((resolve)=> {
            basemysql.myquery('select * from pro_theme where KindID=? order by ThemeID limit 0,?', [id, num], async(results) => {
                var temparray = [];
                for (var i in results) {
                    var tempobj = {};
                    tempobj.themeid = results[i].ThemeID;
                    tempobj.title = results[i].ThemeTitle;
                    tempobj.mainimg = results[i].MainImg;
                    tempobj.logo = results[i].Logo;
                    tempobj.detail = results[i].ThemeDetail;
                    temparray.push(tempobj);
                }
                resolve(temparray);
            });
        })
    },
    getThemeListByKind (id) {
        return new Promise((resolve)=> {
            basemysql.myquery('SELECT KindID FROM pro_theme WHERE ThemeID=?', [id], async(result)=> {
                var data = await this.getThemeListNoHot(result[0].KindID, 3);
                resolve(data);
            })
        })
    }
}

module.exports = mysql;
