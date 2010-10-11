var EventEmitter = require('events').EventEmitter;
var Hash = require('traverse').Hash;

Lazy.prototype = new EventEmitter;
module.exports = Lazy;
function Lazy (em) {
    if (!(this instanceof Lazy)) return new Lazy(em);
    var self = this;

    function newLazy (g, h) {
        if (!g) g = function () { return true };
        if (!h) h = function (x) { return x };
        var lazy = new Lazy;
        self.on('data', function (x) {
            if (g.call(lazy, x)) lazy.emit('data', h(x));
        });
        self.once('end', function () { lazy.emit('end') });
        return lazy;
    }
    
    self.once = function (name, f) {
        self.on(name, function g () {
            self.removeListener(name, g);
            f.apply(this, arguments);
        });
    };
    
    self.filter = function (f) {
        return newLazy(function (x) {
            return f(x);
        });
    }

    self.forEach = function (f) {
        return newLazy(function (x) {
            f(x);
            return true;
        });
    }

    self.map = function (f) {
        return newLazy(
            function () { return true },
            function (x) { return f(x) }
        );
    }

    self.head = function (f) {
        var lazy = newLazy();
        lazy.on('data', function g (x) {
            f(x)
            lazy.removeListener('data', g)
        })
    }

    self.tail = function () {
        var skip = true;
        return newLazy(function () {
            if (skip) {
                skip = false;
                return false;
            }
            return true;
        });
    }

    self.take = function (n) {
        return newLazy(function () {
            var alive = n-- > 0;
            if (!alive) this.emit('end');
            return alive;
        });
    }

    self.takeWhile = function (f) {
        var cond = true;
        return newLazy(function (x) {
            if (cond && f(x)) return true;
            cond = false;
            return false;
        });
    }

    self.foldr = function (op, i, f) {
        var acc = i;
        var lazy = newLazy();
        lazy.on('data', function g (x) {
            acc = op(x, acc);
        });
        lazy.once('end', function () {
            f(acc);
        });
    }

    self.sum = function (f) {
        return self.foldr(function (x, acc) { return x + acc }, 0, f);
    }

    self.product = function (f) {
        return self.foldr(function (x, acc) { return x*acc }, 1, f);
    }

    self.join = function (f) {
        var data = []
        var lazy = newLazy(function (x) {
            data.push(x);
            return true;
        });
        lazy.once('end', function () { f(data) });
    }
}

