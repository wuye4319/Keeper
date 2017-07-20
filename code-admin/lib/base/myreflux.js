/**
 * Created by nero on 2016/12/10.
 */
'use strict';
const myreflux = {
    objarr: {},
    temparr: {},
    on: function (key, fn) {
        if (this.objarr[key] === undefined) {
            this.objarr[key] = [];
        }
        this.objarr[key].push(fn);
    },
    one: function (key, fn) {
        if (this.temparr[key] === undefined) {
            this.temparr[key] = [];
        }
        this.temparr[key].push(fn);
    },
    off: function (key) {
        this.objarr[key] = [];
        this.temparr[key] = [];
    },
    debug: function () {
        console.log(this.objarr, this.temparr);
    },
    trigger: function () {
        var key, args;
        var objarr = this.objarr;
        var temparr = this.temparr;
        if (arguments.length == 0) return false;
        key = arguments[0];
        args = [].concat(Array.prototype.slice.call(arguments, 1));
        //apply
        if (objarr[key] !== undefined && objarr[key].length > 0) {
            for (let i in objarr[key]) {
                objarr[key][i].apply(null, args);
            }
        } else if (temparr[key] !== undefined && temparr[key].length > 0) {
            for (let i in temparr[key]) {
                temparr[key][i].apply(null, args);
                temparr[key][i] = undefined;
            }
            temparr[key] = [];
        } else {
            console.log("Invalid keyword!!!".red);
        }
    }
};

module.exports = myreflux;