/**
 * author:nero
 * version:v1.0
 * robot will help me to control all things
 */
;'use strict';
var util = require("util");
var fs = require('fs');
var mysql = require('../ctrl/mysql');
var basesql = require('../base/mysql');
var excel = require('./excel');
excel = new excel();
var config = require('../../config/robconf');
var delay = config.delay;
var datalist = [], listindex = 0;

//constructor
class Robot {
    constructor() {
        this.options = {
            stream: process.stdout
        };
    }

    async robot() {
        console.log("robot is running!".green);
        await this.excel();
        await this.delay(delay.excel);
        this.proxycontrol();
    }

    endsql() {//end mysql connection
        basesql.endconn();
    }

    excel() {//transfrom excel data to json
        return new Promise((resolve)=> {
            datalist = excel.boot();
            console.log("excel data is read complete! proxy will working at 5 seconds later!".green);
            resolve();
        })
    }

    //init the plugin 'phantom'
    async mysql() {
        /** A proid
         *  B proname
         *  C mainimg
         *  F price
         *  L prohref
         */
        console.log("proxy".blue + listindex);
        var param = config.param;
        var data = {
            ProName: datalist[listindex].B,
            MainImg: datalist[listindex].C,
            Price: datalist[listindex].F,
            ProHref: datalist[listindex].L,
            ProKind: param.ProKind,
            ThemeID: param.ThemeID,
            IsPub: param.IsPub
        };
        //add product and get infor after insert.
        await mysql.addpro(data);
        //console.log(await mysql.getpro(13));
        listindex++;
    }

    async proxycontrol() {//control of proxy and mysql
        await this.mysql();
        await this.delay(delay.mysql);
        if (listindex < datalist.length) {
            this.proxycontrol();
        } else {
            console.log("all mission is finished!".red);
            this.endsql();
        }
    }

    async delay(second) {
        //console.log("delay".red);
        var islast = (listindex == datalist.length);
        var count = islast ? 0 : second;
        await this.timer(islast, count);
    }

    timer(islast, count) {
        return new Promise((resolve)=> {
            var self = this;
            const sth = function () {
                if (!islast) {
                    self.options.stream.clearLine();
                    self.options.stream.cursorTo(0);
                    count == 0 ? console.log(count) : self.options.stream.write(count.toString());
                }
                count--;
                if (count >= 0) {
                    setTimeout(function () {
                        sth(islast, count);
                    }, 1000);
                } else {
                    console.log("rest is over!".blue);
                    resolve();
                }
            }
            sth();
        })
    }
}

module.exports = Robot;