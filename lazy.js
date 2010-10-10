var EventEmitter = require('events').EventEmitter;

Lazy.prototype = new EventEmitter;
module.exports = Lazy;
function Lazy () {
    if (!(this instanceof Lazy)) return new Lazy([].slice.call(arguments));
    var self = this;

    function newLazy (g, h) {
        if (!g) g = function () { return true };
        if (!h) h = function (x) { return x };
        var lazy = new Lazy;
        self.on('data', function (x) {
            if (g.call(lazy, x)) lazy.emit('data', h(x));
        });
        return lazy;
    }

    self.filter = function (f) {
        return newLazy(function (x) {
            return f(x);
        });
    }

    self.forEach = function (f) {
        self.on('data', f);
        return self;
    }

    self.map = function (f) {
        return newLazy(
            function () { return true },
            function (x) { return f(x) }
        );
    }

    self.take = function (n) {
        return newLazy(function () {
            return n-- > 0;
        });
    }
}

