/**
 * author:nero
 * version:v1.0
 * plugin:init js
 */
;'use strict';
var basemysql = require("../base/mysql");

var mysql = {
    addpro: function (data) {
        basemysql.myquery('insert into product set ?', data, function (results) {
            if (results.insertId) {
                console.log("data insert success!".green);
                this.getpro(results.insertId);
            } else {
                console.log("data insert failed!".red);
            }
        });
    },
    getpro: function (id) {
        basemysql.myquery('select * from product where ID=? ', id, function (results) {
            console.log(results);
        });
    },
    getprobyid: (id)=> {
        var temp = {};
        basemysql.myquery("SELECT * FROM product WHERE ID=?", id, (results)=> {
            temp.id = results[0].ID;
            temp.mainimg = results[0].MainImg;
            temp.proname = results[0].ProName;
            return temp;
        })
    },
    getprolist: function (id, page) {
        basemysql.myquery('SELECT * FROM product WHERE ThemeID=? AND IsPub=1 ORDER BY CreatDate DESC LIMIT ?,10', [id, page], function (results) {
            for (var i in results) {
                console.log("商品id : ".red + results[i].ID);
                console.log("主图 : ".green + results[i].MainImg);
                console.log("名称 : ".green + results[i].ProName);
                console.log("链接 : ".green + results[i].ProHref);
                console.log("价格 : ".green + results[i].Price + " , 类别 : ".green + results[i].ProKind + " , 来源 : ".green + results[i].From);
                console.log("喜欢 : ".green + results[i].Favor + " , 主题id : ".green + results[i].ThemeID);
                console.log("创建时间 : ".green + results[i].CreatDate);
                console.log("排序 : ".green + results[i].MySort + " , 发布 : ".green + results[i].IsPub + " , 最热 : ".green + results[i].IsHot + " , 特价 : ".green + results[i].IsSale);
            }
        });
    },
    getthemelist: function (id, page) {
        basemysql.myquery('select * from pro_theme where KindID=? order by ThemeID limit ?,10', [id, page], function (results) {
            for (var i in results) {
                console.log("主题id : ".red + results[i].ThemeID);
                console.log("主题标题 : ".green + results[i].ThemeTitle);
                console.log("Logo : ".green + results[i].Logo);
                console.log("主图 : ".green + results[i].MainImg);
                console.log("描述 : ".green + results[i].ThemeDetail);
                console.log("所属类别 : ".green + results[i].KindID);
                console.log("最后修改时间 : ".green + results[i].LastEditTime);
                console.log("阅读数 : ".green + results[i].ReadNumb);
            }
        });
    },
    getkind: function () {
        basemysql.myquery('SELECT * FROM pro_kind', "", function (results) {
            console.log("请输入序号来选择类别。[id page]".green);
            for (var i in results) {
                var index = parseInt(i) + 1;
                console.log(index.toString().green + ".".red + results[i].KindName);
            }
        });
    },
    gettheme: function () {
        basemysql.myquery('SELECT * FROM pro_theme', "", function (results) {
            console.log("请输入序号来选择类别。[id page]".green);
            for (var i in results) {
                var index = parseInt(i) + 1;
                console.log(index.toString().green + ".".red + results[i].ThemeTitle);
            }
        });
    }
}

module.exports = mysql;
