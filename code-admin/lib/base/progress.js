/**
 * Created by nero on 2017/4/13.
 */
var ProgressBar = require('./node-progress');

var bar = new ProgressBar(' :title [:bar] :percent ', {
    complete: '='
    , incomplete: ' '
    , width: 30
    , total: 100
});

function progress() {
}

progress.prototype.start = function (title) {
    if (bar.curr < 99) {
        bar.tick(1, {title: "static"});
    }
}

progress.prototype.toend = function () {
    var index=100-bar.curr;
    bar.tick(index, {title: "static"});
}

progress.prototype.end = function (msg) {
    if (bar.complete) {
        console.log(msg);
    }
}

function backward() {
    bar.tick(-1, {title: 'backward'});
    if (bar.curr == 0) {
        bar.terminate();
    } else {
        setTimeout(backward, 20);
    }
}

module.exports = progress;