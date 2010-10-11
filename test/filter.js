var Lazy = require('lazy');
var EventEmitter = require('events').EventEmitter;

function range(i, j) {
    var r = [];
    for (;i<j;i++) r.push(i);
    return r;
}

var lazy = new Lazy;
lazy.filter(function(x) { return x > 5 }).map(function (x) { return x*2 }).take(2).forEach(function (x) {
    console.log(x);
});

range(0,10).forEach(function (x) {
    lazy.emit('data', x);
});

